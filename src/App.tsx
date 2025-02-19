import { Fragment, useEffect, useState } from "react";
import Main from "./main/Main";
import { Route, Routes } from "react-router-dom";
import LeftSidebar from "./public/pages/LeftSidebar.tsx";
import WalletTable from "./wallets/pages/WalletTable.tsx";
import SignIn from "./authentication/SingIn.tsx";
import LetterTable from "./wallets/pages/LettersTable.tsx";
import BankTable from "./wallets/pages/BankTable.tsx";

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
                    <Route path="/wallets" element={<WalletTable/>} />
                    <Route path="/letters" element={< LetterTable/>} />
                    <Route path="/banks" element={< BankTable/>} />

                </Route>
            </Routes>
        </Fragment>
    );
};

export default App;