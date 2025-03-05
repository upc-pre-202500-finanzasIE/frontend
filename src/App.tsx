import { Fragment, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Main from "./main/Main";
import LeftSidebar from "./public/pages/LeftSidebar.tsx";
import WalletTable from "./wallets/pages/WalletTable.tsx";
import LetterTable from "./wallets/pages/LettersTable.tsx";
import BankTable from "./wallets/pages/BankTable.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import SignInPage from "./wallets/components/SignInPage.tsx";
import AboutTheApp from "./wallets/forms/AboutTheApp.tsx";

const App = () => {
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const location = useLocation(); // 🔹 Obtiene la ruta actual

    useEffect(() => {
        const updateSize = () => {
            setScreenWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setIsLeftSidebarCollapsed(true);
            }
        };
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <Fragment>
            {location.pathname !== "/" && (
                <LeftSidebar
                    isLeftSidebarCollapsed={isLeftSidebarCollapsed}
                    changeIsLeftSidebarCollapsed={(value) =>
                        setIsLeftSidebarCollapsed(value)
                    }
                />
            )}

            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route
                    element={
                        <Main
                            screenWidth={screenWidth}
                            isLeftSidebarCollapsed={isLeftSidebarCollapsed}
                        />
                    }
                >
                    <Route path="/wallets" element={<ProtectedRoute element={<WalletTable />} />} />
                    <Route path="/letters" element={<ProtectedRoute element={<LetterTable />} />} />
                    <Route path="/banks" element={<ProtectedRoute element={<BankTable />} />} />
                    <Route path="/about-app" element={<ProtectedRoute element={<AboutTheApp/>} />} />
                </Route>
            </Routes>
        </Fragment>
    );
};

export default App;
