import styled from "@emotion/styled";

const C = {
  bg: "#1e1e1e",
  primary: "#ffffff",
  muted: "#c2c7d1",
  border: "#ffffff",
};

export const PrintRoot = styled.div`
  background-color: ${C.bg};
  color: ${C.primary};
  font-family: Helvetica, Arial, sans-serif;
  font-size: 9pt;
  padding: 32px 40px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 0;
  }
`;

export const DocTitle = styled.div`
  font-size: 13pt;
  font-weight: bold;
  color: ${C.primary};
  text-align: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.div`
  font-size: 13pt;
  font-weight: bold;
  color: ${C.primary};
  margin: 22px 0 10px;
`;

export const LargeSectionTitle = styled.div`
  font-size: 15pt;
  font-weight: bold;
  color: ${C.primary};
  margin: 22px 0 10px;
`;

export const JustTitle = styled.div`
  font-size: 15pt;
  font-weight: bold;
  color: ${C.primary};
  margin: 18px 0 10px;
`;

export const DocParagraph = styled.p`
  font-size: 11pt;
  color: ${C.primary};
  text-align: justify;
  line-height: 1.5;
  margin: 0 0 10px;
`;

/* ── Tables ── */

const baseTableCss = `
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;

export const InfoTable = styled.table`
  ${baseTableCss}

  td {
    border: 1px solid ${C.border};
    padding: 5px 8px;
    font-size: 10pt;
    vertical-align: top;
  }

  td:first-of-type {
    font-weight: bold;
    color: ${C.primary};
    width: 40%;
  }

  td:last-of-type {
    color: ${C.muted};
  }
`;

export const DataTable = styled.table`
  ${baseTableCss}
  table-layout: fixed;

  th {
    border: 1px solid ${C.border};
    padding: 6px 8px;
    font-size: 9pt;
    font-weight: bold;
    text-align: center;
    color: ${C.primary};
    word-wrap: break-word;
  }

  td {
    border: 1px solid ${C.border};
    padding: 6px 8px;
    font-size: 9pt;
    color: ${C.muted};
    vertical-align: top;
    word-wrap: break-word;
  }
`;

export const BalanceTable = styled.table`
  border-collapse: collapse;
  margin-top: 10px;
  margin-bottom: 12px;
  margin-left: 60px;

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  td {
    border: 1px solid ${C.border};
    padding: 5px 8px;
    font-size: 9pt;
    vertical-align: middle;
  }

  td:first-of-type {
    font-weight: bold;
    color: ${C.primary};
    width: 200px;
  }

  td:last-of-type {
    color: ${C.muted};
    width: 260px;
  }
`;

/* ── Section 2 ── */

export const SectionTwoTable = styled.table`
  border-collapse: collapse;
  margin-bottom: 12px;
  table-layout: fixed;
  width: 100%;

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  td {
    border: 1px solid ${C.border};
    padding: 6px 8px;
    font-size: 10pt;
    vertical-align: middle;
  }

  td.s2-label {
    font-weight: bold;
    color: ${C.primary};
    width: 53%;
  }

  td.s2-option {
    font-weight: bold;
    color: ${C.primary};
    text-align: center;
    width: 8%;
  }

  td.s2-mark {
    color: ${C.primary};
    text-align: center;
    font-weight: bold;
    font-size: 13pt;
    width: 6%;
  }
`;