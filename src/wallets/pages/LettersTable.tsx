import React, { useState, useEffect } from "react";
import { Table, Menu, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LettersButtonsComponent from "../components/LettersButtonsComponent";
import { getAllLetters } from "../services/LetterService";

interface DataType {
    key: string;
    id: string;
    cliente: string;
    fechaFirma: string;
    valorNominal: string;
    fechaVencimiento: string;
    plazo: number;
    soles: boolean;
    dolares: boolean;
    estado: string;
}

const LetterTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState<{ [key: string]: boolean }>({});
    const [data, setData] = useState<DataType[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const letters = await getAllLetters();
            setData(letters.map((letter: any) => ({
                ...letter,
                key: letter.id,
                tipoMoneda: letter.soles ? "Soles" : letter.dolares ? "Dólares" : "",
                estado: letter.estado
            })));
        } catch (error) {
            toast.error("Error fetching letters", { position: "top-right", autoClose: 3000 });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDropdownVisibleChange = (key: string, visible: boolean) => {
        setDropdownVisible((prev) => ({ ...prev, [key]: visible }));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: DataType[]) => {
            if (selectedKeys.length > 1) {
                const newSelectedKey = selectedKeys[selectedKeys.length - 1];
                setSelectedRowKeys([newSelectedKey as string]);
                setIsItemSelected(true);
                setSelectedLetterId(newSelectedKey as string);
            } else {
                const selectedId = selectedRows.length > 0 ? selectedRows[0].id : null;
                setSelectedRowKeys(selectedKeys as string[]);
                setIsItemSelected(selectedKeys.length > 0);
                setSelectedLetterId(selectedId);
            }
        },
        type: "checkbox",
    };

    const columns = [
        { title: "Código", dataIndex: "id", key: "id", width: 100 },
        { title: "Cliente", dataIndex: "cliente", key: "cliente", width: 200 },
        { title: "Fecha de Firma", dataIndex: "fechaFirma", key: "fechaFirma", width: 150 },
        { title: "Fecha de Vencimiento", dataIndex: "fechaVencimiento", key: "fechaVencimiento", width: 150 },
        { title: "Valor Nominal", dataIndex: "valorNominal", key: "valorNominal", width: 150 },
        { title: "Estado", dataIndex: "estado", key: "estado", width: 150 },
        { title: "Plazo", dataIndex: "plazo", key: "plazo", width: 100 },
        { title: "Tipo de Moneda", dataIndex: "tipoMoneda", key: "tipoMoneda", width: 150 },
    ];

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    return (
        <div>
            <LettersButtonsComponent isItemSelected={isItemSelected} selectedLetterId={selectedLetterId} onFormSubmit={fetchData} />
            <Table
                bordered
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: pageSize,
                    pageSizeOptions: ["5", "10", "25", "100"],
                    showSizeChanger: true,
                    onShowSizeChange: handlePageSizeChange,
                }}
            />
            <ToastContainer />
        </div>
    );
};

export default LetterTable;