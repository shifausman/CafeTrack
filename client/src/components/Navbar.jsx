import { useEffect, useState, useRef } from "react";
import { BiBell, BiReceipt, BiX } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";
import "./Navbar.css";

function Navbar() {
    const [dateStr, setDateStr] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const d = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        setDateStr(d.toLocaleDateString('en-US', options));
    }, []);

    // Close notifications when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const generateReport = () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 1500));
        toast.promise(
            promise,
            {
                pending: 'Generating Report...',
                success: 'Report downloaded successfully!',
                error: 'Failed to generate report'
            }
        );
    };

    return (
        <header className="navbar">
            <div className="nav-left">
                <div className="date">{dateStr}</div>
            </div>

            <div className="nav-right">
                <div className="nav-stats">
                    Total Orders : <strong>20</strong>
                </div>

                <button className="nav-icon-btn" onClick={generateReport}>
                    <span>Report</span>
                    <BiReceipt />
                </button>

                <div className="notification-wrapper" ref={notifRef} onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer', position: 'relative' }}>
                    <BiBell />
                    <span className="badge">2</span>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute', top: '40px', right: '-10px', width: '300px',
                            backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border-color)', zIndex: 100, overflow: 'hidden',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontSize: '14px' }}>Notifications</h4>
                                <BiX size={20} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setShowNotifications(false); }} />
                            </div>
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                                <strong>Low Stock Alert</strong><br />
                                <span style={{ color: 'var(--text-muted)' }}>Milk is running extremely low (1.5L remaining).</span>
                            </div>
                            <div style={{ padding: '16px', fontSize: '13px' }}>
                                <strong>New Order</strong><br />
                                <span style={{ color: 'var(--text-muted)' }}>Order #2041 was placed successfully.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                        alt="User avatar"
                        className="avatar"
                    />
                    <div className="user-info">
                        <span className="user-name">Samantha W</span>
                        <span className="user-role">Cashier</span>
                    </div>
                    <MdKeyboardArrowDown style={{ color: "var(--text-muted)", fontSize: "18px" }} />
                </div>
            </div>
        </header>
    );
}

export default Navbar;