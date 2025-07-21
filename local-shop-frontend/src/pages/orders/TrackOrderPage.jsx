// src/pages/orders/TrackOrderPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/hooks/useAuth';
import { socket } from '@/socket';
import { FiPackage, FiCheckCircle, FiTruck, FiMapPin, FiUser, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusSteps = ['pending', 'accepted', 'out_for_delivery', 'delivered'];

const StatusTimeline = ({ currentStatus }) => {
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between my-8">
      {statusSteps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${index <= currentIndex ? 'bg-primary border-primary text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              {step === 'pending' && <FiPackage size={24} />}
              {step === 'accepted' && <FiCheckCircle size={24} />}
              {step === 'out_for_delivery' && <FiTruck size={24} />}
              {step === 'delivered' && <FiHome size={24} />}
            </div>
            <p className={`mt-2 text-xs font-semibold uppercase transition-all duration-300 ${index <= currentIndex ? 'text-white' : 'text-slate-500'}`}>
              {step.replace('_', ' ')}
            </p>
          </div>
          {index < statusSteps.length - 1 && (
            <div className={`flex-grow h-1 mx-2 rounded ${index < currentIndex ? 'bg-primary' : 'bg-slate-700'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const TrackOrderPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentLocation, setAgentLocation] = useState(null);
  const { user } = useAuth();
  const mapRef = useRef(null); // To hold the map instance

  useEffect(() => {
    // Fetch initial order details
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}/track`);
        setOrder(data.data);
        if (data.data.deliveryAgentId?.currentLocation?.coordinates) {
          const [lng, lat] = data.data.deliveryAgentId.currentLocation.coordinates;
          setAgentLocation({ lat, lng });
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Socket.io connection and listeners
    socket.connect();
    socket.emit('joinOrderRoom', orderId);

    socket.on('locationUpdated', ({ location }) => {
      console.log('Received new location:', location);
      setAgentLocation(location);
    });

    return () => {
      // Cleanup on component unmount
      socket.disconnect();
    };
  }, [orderId]);


  const handleStatusUpdate = async (newStatus) => {
    try {
        const { data } = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        setOrder(data.data);
        toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
        toast.error("Failed to update status.");
    }
  }

  // Simulate sending a location update (for delivery agent role)
  const sendLocationUpdate = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            socket.emit('updateLocation', {
                orderId,
                agentId: user._id,
                location
            });
            toast.success("Location updated!");
        });
    } else {
        toast.error("Geolocation is not supported by this browser.");
    }
  }


  if (loading) return <Loader />;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Track Order #{order._id.slice(-6)}</h1>
      
      <div className="glass-card p-6">
        <StatusTimeline currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Delivery Agent Controls */}
            {user.role === 'delivery' && order.status !== 'delivered' && (
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Delivery Agent Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => handleStatusUpdate('accepted')} className="glow-button">Accept Order</button>
                        <button onClick={() => handleStatusUpdate('out_for_delivery')} className="glow-button">Start Delivery</button>
                        <button onClick={() => handleStatusUpdate('delivered')} className="glow-button">Mark as Delivered</button>
                        <button onClick={sendLocationUpdate} className="glow-button">Update My Location</button>
                    </div>
                </div>
            )}

          {/* Map Section - Placeholder */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Live Location</h3>
            <div className="bg-slate-800 h-64 rounded-lg flex items-center justify-center text-slate-400">
                <p>Map Integration Placeholder</p>
                {agentLocation && (
                    <div className="mt-4 p-2 bg-slate-700 rounded font-mono text-xs">
                        Agent Location: Lat: {agentLocation.lat.toFixed(4)}, Lng: {agentLocation.lng.toFixed(4)}
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center"><FiTruck className="mr-2 text-primary"/> Delivery Details</h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-slate-400">Agent:</span> {order.deliveryAgentId?.name || 'Not Assigned'}</p>
                <p><span className="font-semibold text-slate-400">Vehicle:</span> {order.deliveryAgentId?.vehicleDetails || 'N/A'}</p>
                <p><span className="font-semibold text-slate-400">Phone:</span> {order.deliveryAgentId?.phone || 'N/A'}</p>
            </div>
          </div>
           <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center"><FiUser className="mr-2 text-primary"/> Customer Details</h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-slate-400">Name:</span> {order.userId.name}</p>
                <p><span className="font-semibold text-slate-400">Address:</span> {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This line fixes the error
export default TrackOrderPage;