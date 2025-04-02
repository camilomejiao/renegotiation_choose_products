import { useEffect } from "react";
import { Accordion } from "react-bootstrap";

import './ListCollectionAccount.css';

export const ListCollectionAccount = () => {

    const getListCollectionAccount = () => {

    }

    useEffect(() => {
        getListCollectionAccount();
    }, []);

    return (
        <>
            <Accordion defaultActiveKey="0" className="custom-accordion">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>📌 Cuenta de cobro SP-01</Accordion.Header>
                    <Accordion.Body>
                        SP-01 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion defaultActiveKey="1" className="custom-accordion">
                <Accordion.Item eventKey="1">
                    <Accordion.Header>📌 Cuenta de cobro SP-02</Accordion.Header>
                    <Accordion.Body>
                        SP-02 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}