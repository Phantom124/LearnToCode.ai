import user from "../../../../assets/icons8-user.svg"
import logo from "../../../../assets/learntocode_logo.svg"
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {

    const menuItems = [
        { id: 'test', label: 'Practice', path: '/practice' },
        { id: 'leaderboard', label: 'Leaderboard',  path: '/leaderboard' },
        
    ];

    return(
        <div className="sidebar">
            <div>
                <div className="sidebar-header">
                    <div className="logo">
                        <img src={logo}/>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {menuItems.map((item) => (
                            <li key={item.id} className="nav-item-container">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => 
                                    isActive ? 'nav-item active' : 'nav-item'
                                }
                                >
                                    <span className="nav-label">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar"><img src={user}/></div>
                    <div className="user-details">
                        <div className="user-name">User</div>
                        <div className="user-plan">Free Plan</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;