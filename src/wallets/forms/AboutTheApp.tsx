import React from "react";

const AboutTheApp: React.FC = () => {
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>FinanceYou</h1>
            <p>FinanceYou es una aplicación web para optimizar la gestión de carteras de letras/facturas descontadas para pequeñas y medianas empresas (PYMEs). La aplicación soporta tanto Soles peruanos como Dólares estadounidenses, así como tasas de interés nominales y efectivas, y calcula la Tasa de Costo Efectivo Anual (TCEA) para letras/facturas descontadas en una fecha específica.</p>
            <ul style={{ listStyleType: "disc", textAlign: "left", display: "inline-block" , marginTop: "20px"}}>
                <li>Autenticación segura de usuarios</li>
                <li>Gestión de letras/facturas</li>
                <li>Reportes completos</li>
                <li>Soporte multimoneda y multitasa</li>
                <li>Cálculo de TCEA</li>
            </ul>
            <h2 style={{  marginTop: "20px"}}>Beneficios:</h2>
            <ul style={{ listStyleType: "disc", textAlign: "left", display: "inline-block" ,  marginTop: "20px"}}>
                <li>Eficiencia: Automatiza la gestión de letras/facturas descontadas, ahorrando tiempo y reduciendo errores.</li>
                <li>Flexibilidad: Funciona con múltiples monedas y tasas de interés, adaptándose a diversas necesidades financieras.</li>
                <li>Seguridad: Garantiza la protección de datos con autenticación segura de usuarios.</li>
                <li>Transparencia: Proporciona reportes detallados para una mejor toma de decisiones financieras.</li>
            </ul>
        </div>
    );
};

export default AboutTheApp;