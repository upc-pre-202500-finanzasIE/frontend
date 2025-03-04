import React, { useEffect, useState } from 'react';
import { Modal, Table, Button } from 'antd';
import { getLettersByWalletId } from '../services/LetterService';
import { getWalletById } from '../services/WalletService';
import { getBankById } from '../services/BanksService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './WalletDetailsModal.css'; // Import the CSS file

interface Letter {
    id: string;
    cliente: string;
    fechaFirma: string;
    valorNominal: string;
    fechaVencimiento: string;
    plazo: number;
    soles: boolean;
    dolares: boolean;
    estado: string;
    tasaEfectivaPorDias: number;
    plazoDiasDescuento: number;
    valorTasaDescontada: number;
}

interface WalletDetailsModalProps {
    visible: boolean;
    onCancel: () => void;
    walletName: string;
    walletId: string;
}

const WalletDetailsModal: React.FC<WalletDetailsModalProps> = ({ visible, onCancel, walletName, walletId }) => {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [walletDetails, setWalletDetails] = useState<any>(null);
    const [bankDetails, setBankDetails] = useState<any>(null);
    const [modalWidth, setModalWidth] = useState<number>(800);

    useEffect(() => {
        if (walletId) {
            fetchLetters();
            fetchWalletDetails();
        }
    }, [walletId]);

    const fetchLetters = async () => {
        try {
            const response = await getLettersByWalletId(walletId);
            setLetters(response);
            calculateModalWidth();
        } catch (error) {
            console.error('Error fetching letters:', error);
        }
    };

    const fetchWalletDetails = async () => {
        try {
            const response = await getWalletById(walletId);
            setWalletDetails(response);
            fetchBankDetails(response.bank);
        } catch (error) {
            console.error('Error fetching wallet details:', error);
        }
    };

    const fetchBankDetails = async (bankId: number) => {
        try {
            const response = await getBankById(bankId);
            setBankDetails(response);
        } catch (error) {
            console.error('Error fetching bank details:', error);
        }
    };

    const calculateModalWidth = () => {
        const columnWidths = columns.reduce((total, column) => total + (column.width || 0), 0);
        setModalWidth(columnWidths + 100); // Adding some padding
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById('modal-content');
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('modal-content.pdf');
            });
        }
    };

    const columns = [
        { title: 'Código', dataIndex: 'id', key: 'id', width: 100 },
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente', width: 200 },
        { title: 'Fecha de Firma', dataIndex: 'fechaFirma', key: 'fechaFirma', width: 150 },
        { title: 'Fecha de Vencimiento', dataIndex: 'fechaVencimiento', key: 'fechaVencimiento', width: 150 },
        { title: 'Valor Nominal', dataIndex: 'valorNominal', key: 'valorNominal', width: 150 },
        { title: 'Plazo', dataIndex: 'plazo', key: 'plazo', width: 100 },
        {
            title: 'Tipo de Moneda',
            dataIndex: 'tipoMoneda',
            key: 'tipoMoneda',
            width: 150,
            render: (_: any, record: Letter) => record.soles ? 'Soles' : 'Dolares'
        },
        { title: 'Estado', dataIndex: 'estado', key: 'estado', width: 150 },
        {
            title: 'Tasa Efectiva por Días',
            dataIndex: 'tasaEfectivaPorDias',
            key: 'tasaEfectivaPorDias',
            width: 150,
            render: (value: number) => `${(value * 100).toFixed(2)}%`
        },
        { title: 'Plazo Días Descuento', dataIndex: 'plazoDiasDescuento', key: 'plazoDiasDescuento', width: 150 },
        { title: 'Valor Tasa Descontada', dataIndex: 'valorTasaDescontada', key: 'valorTasaDescontada', width: 150 },
    ];

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={modalWidth}
            title={<div className="modal-title">Detalle a profundidad de la cartera {walletName}</div>}
        >
            <div id="modal-content">
                <Table
                    bordered
                    columns={columns}
                    dataSource={letters}
                    pagination={false}
                    rowKey="id"
                />
                {walletDetails && (
                    <div>
                        <div>Valor Neto: {walletDetails.valorNeto}</div>
                        <div>Valor Nominal: {walletDetails.valorNominalConjunto}</div>
                        <div>Valor Recibido: {walletDetails.valorRecibido}</div>
                    </div>
                )}
                {bankDetails && (
                    <div>
                        <div><strong>Información del banco</strong></div>
                        <div>Nombre del Banco: {bankDetails.nombreBanco}</div>
                        <div>
                            La tasa ofrecida por la institución financiera es de {bankDetails.tasaDeInteres}% y es {bankDetails.efectiva ? 'Efectiva' : 'Nominal'}
                        </div>
                    </div>
                )}
            </div>
            <Button onClick={handleDownloadPDF}>Descargar PDF</Button>
        </Modal>
    );
};

export default WalletDetailsModal;