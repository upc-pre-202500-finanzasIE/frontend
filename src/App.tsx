import { Fragment, useEffect, useState } from "react";
import Main from "./main/Main";
import { Route, Routes } from "react-router-dom";
import LeftSidebar from "./public/pages/LeftSidebar.tsx";
import Wallet from "./wallets/pages/Wallet.tsx";
import SignIn from "./authentication/SingIn.tsx";

const App = () => {
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] =
        useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

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
            <LeftSidebar
                isLeftSidebarCollapsed={isLeftSidebarCollapsed}
                changeIsLeftSidebarCollapsed={(value) =>
                    setIsLeftSidebarCollapsed(value)
                }
            />
            <Routes>
                <Route
                    element={
                        <Main
                            screenWidth={screenWidth}
                            isLeftSidebarCollapsed={isLeftSidebarCollapsed}
                        />
                    }
                >
                    <Route path="" element={<SignIn />} />
                    <Route path="/wallets" element={<Wallet/>} />
                    <Route path="/sign-in" element={< SignIn/>} />

                </Route>
            </Routes>
        </Fragment>
    );
};

export default App;