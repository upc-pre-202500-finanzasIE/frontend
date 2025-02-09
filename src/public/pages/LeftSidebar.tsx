import { Link } from "react-router-dom";
import "./left-sidebar.css";
import classNames from "classnames";
import { Fragment } from "react/jsx-runtime";
import { FaApple, FaBoxOpen, FaFile, FaCog, FaBars, FaTimes } from "react-icons/fa";

type LeftSidebarProps = {
    isLeftSidebarCollapsed: boolean;
    changeIsLeftSidebarCollapsed: (isLeftSidebarCollapsed: boolean) => void;
};

const LeftSidebar = ({
                         isLeftSidebarCollapsed,
                         changeIsLeftSidebarCollapsed,
                     }: LeftSidebarProps) => {
    const items = [
        {
            routerLink: "",
            icon: <FaApple />,
            label: "Wallets",
        },
        {
            routerLink: "products",
            icon: <FaBoxOpen />,
            label: "My Finances",
        },
        {
            routerLink: "pages",
            icon: <FaFile />,
            label: "About app",
        },
        {
            routerLink: "settings",
            icon: <FaCog />,
            label: "Settings",
        },
    ];

    const sidebarClasses = classNames({
        sidenav: true,
        "sidenav-collapsed": isLeftSidebarCollapsed,
    });

    const closeSidenav = () => {
        changeIsLeftSidebarCollapsed(true);
    };

    const toggleCollapse = (): void => {
        changeIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
    };

    return (
        <div className={sidebarClasses}>
            <div className="logo-container">
                <button className="logo" onClick={toggleCollapse}>
                    <FaBars />
                </button>
                {!isLeftSidebarCollapsed && (
                    <Fragment>
                        <div className="logo-text">App</div>
                        <button className="btn-close" onClick={closeSidenav}>
                            <FaTimes className="close-icon" />
                        </button>
                    </Fragment>
                )}
            </div>
            <div className="sidenav-nav">
                {items.map((item) => (
                    <li key={item.label} className="sidenav-nav-item">
                        <Link className="sidenav-nav-link" to={item.routerLink}>
                            <i className="sidenav-link-icon">{item.icon}</i>
                            {!isLeftSidebarCollapsed && (
                                <span className="sidenav-link-text">{item.label}</span>
                            )}
                        </Link>
                    </li>
                ))}
            </div>
        </div>
    );
};

export default LeftSidebar;