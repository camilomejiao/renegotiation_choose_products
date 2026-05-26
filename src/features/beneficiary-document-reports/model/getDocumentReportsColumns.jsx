import {FileTextOutlined} from "@ant-design/icons";
import {BeneficiaryStatusPill} from "../../../entities/beneficiary";

export const getDocumentReportsColumns = ({onOpenDocumentViewer, DocumentActionButton}) => [
    {
        title: "Estado PNIS",
        dataIndex: "holderStatus",
        key: "holderStatus",
        width: 180,
        align: "center",
        render: (value) => <BeneficiaryStatusPill status={value}/>,
    },
    {
        title: "Descripción",
        dataIndex: "description",
        key: "description",
        width: 320,
        ellipsis: false,
    },
    {
        title: "Causal de Graduación",
        align: "center",
        dataIndex: "graduationCause",
        key: "graduationCause",
        width: 260,
    },
    {
        title: "Documento Cierre",
        align: "center",
        dataIndex: "document",
        key: "document",
        width: 180,
        render: (_value, row) => (
            <DocumentActionButton
                type="primary"
                icon={<FileTextOutlined/>}
                onClick={() => onOpenDocumentViewer(row)}
                disabled={!row?.isDocumentEnabled}
            >
                Documento
            </DocumentActionButton>
        ),
    },
];
