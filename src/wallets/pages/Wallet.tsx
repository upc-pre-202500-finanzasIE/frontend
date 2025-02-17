import React, { useState, useEffect } from "react";
import ContainedButtons from "../components/ContainedButtonsComponent.tsx";
import { Table, Menu, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { getAllWallets } from "../services/WalletService.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DataType {
    key: string;
    id: string;
    name: string;
    clientName: string;
    balance: string;
}

const Wallet = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState<{ [key: string]: boolean }>({});
    const [data, setData] = useState<DataType[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const wallets = await getAllWallets();
                const formattedData = wallets.map((wallet: any, index: number) => ({
                    key: index.toString(),
                    id: wallet.id,
                    name: wallet.nombre,
                    clientName: wallet.cliente,
                    balance: wallet.numeroLetrasFacturas.toString(),
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Error fetching wallets:", error);
            }
        };
        fetchData();
    }, []);

    const handleDropdownVisibleChange = (key: string, visible: boolean) => {
        setDropdownVisible((prev) => ({ ...prev, [key]: visible }));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: DataType[]) => {
            if (selectedKeys.length > 1) {
                toast.warning("Solo puede seleccionar una cartera a la vez", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                const selectedId = selectedRows.length > 0 ? selectedRows[0].id : null;
                setSelectedRowKeys(selectedKeys as string[]);
                setIsItemSelected(selectedKeys.length > 0);
                setSelectedWalletId(selectedId);
            }
        },
        type: "radio",
    };


    const columns = [
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: DataType) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="1">Edit</Menu.Item>
                            <Menu.Item key="2">Delete</Menu.Item>
                            <Menu.Item key="3">Ver Detalles</Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                    open={dropdownVisible[record.key] || false}
                    onOpenChange={(visible) => handleDropdownVisibleChange(record.key, visible)}
                >
                    <Button
                        icon={<MoreOutlined />}
                        type="text"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownVisibleChange(record.key, !dropdownVisible[record.key]);
                        }}
                    />
                </Dropdown>
            ),
            width: 20,
        },
        { title: "Código", dataIndex: "id", key: "id", width: 100 },
        { title: "Nombre de la cartera", dataIndex: "name", key: "name", width: 600 },
        { title: "Nombre del cliente", dataIndex: "clientName", key: "clientName", width: 200 },
        { title: "Número de letras/facturas", dataIndex: "balance", key: "balance", width: 150 },
    ];
    const fetchData = async () => {
        try {
            const wallets = await getAllWallets();
            const formattedData = wallets.map((wallet: any, index: number) => ({
                key: index.toString(),
                id: wallet.id,
                name: wallet.nombre,
                clientName: wallet.cliente,
                balance: wallet.numeroLetrasFacturas.toString(),
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching wallets:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            <ContainedButtons
                classWallet="WalletLetter"
                isItemSelected={isItemSelected}
                selectedWalletId={selectedWalletId}
                refreshData={fetchData}
            />
            <Table
                bordered
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: pageSize,
                    pageSizeOptions: ["5", "10", "25", "100"],
                    showSizeChanger: true,
                    onShowSizeChange: (current, size) => setPageSize(size),
                }}
            />
            <ToastContainer />
        </div>
    );
};

export default Wallet;
