//Components
import { HeaderImage } from "../../../shared/header-image/HeaderImage";

//Img
import imgPayments from "../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import territorial from "../../../../../assets/image/payments/territorial.png";
import tecnico from "../../../../../assets/image/payments/tecnico.png";
import supervision from "../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../assets/image/payments/pagos.png";

//Css
import './BeneficiaryReview.css';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";


export const BeneficiaryReview = () => {

    const params = useParams();

    const [title, setTitle] = useState('');
    const [img, setImg] = useState('');

    const capitalizeFirstLetter = (text) => {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getTitleAndImage = (role) => {
        switch(role) {
            case 'territorial':
                setTitle(capitalizeFirstLetter(role));
                setImg(territorial);
                break;
            case 'tecnico':
                setTitle(capitalizeFirstLetter(role));
                setImg(tecnico);
                break;
            case 'pagos':
                setTitle(capitalizeFirstLetter(role));
                setImg(pagos);
                break;
            case 'supervision':
                setTitle(capitalizeFirstLetter(role));
                setImg(supervision);
                break;
        }
    }

    const beneficiaryColumns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Name", width: 400 },
        { field: "identification", headerName: "Identificación", width: 300 },
        { field: "supplier", headerName: "Proveedor", width: 300 },
    ];

    useEffect(() => {
        if(params.role){
            getTitleAndImage(params.role);
        }
    },[params.role]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar la documentación de las órdenes de pago.'}
                backgroundInformationColor={'#40A581'}
            />

            <div className="beneficiary-review-header">
                <div className="beneficiary-review-content">
                    <h4>Revision</h4>
                    <h2>{title}</h2>
                </div>
                <img className="beneficiary-review-img" src={img} alt="Proveedor"/>
            </div>

            <div className="container mt-lg-5">
                <div style={{height: 500, width: "100%"}}>
                    <DataGrid
                        columns={beneficiaryColumns}
                        rows={''}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#40A581",
                                color: "white",
                                fontSize: "12px",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                            "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                                backgroundColor: "#40A581 !important",
                                color: "white !important",
                            },
                            "& .MuiDataGrid-cell": {
                                fontSize: "12px",
                                textAlign: "left",
                                justifyContent: "left",
                                alignItems: "flex-start",
                                display: "flex",
                            },
                            "& .MuiSelect-root": {
                                fontSize: "12px",
                                fontFamily: "Arial, sans-serif",
                                width: "100%",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#E8F5E9",
                            },
                        }}
                    />
                </div>
            </div>

        </>
    )
}