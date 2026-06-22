import { forwardRef } from "react";
import {
  DataTable,
  DocParagraph,
  DocTitle,
  InfoTable,
  JustTitle,
  LargeSectionTitle,
  PrintRoot,
  SectionTitle,
  SectionTwoTable,
} from "./ClosureDocumentPrint.styles";

const SectionOneBlock = ({ sectionOne }) => (
  <>
    <DocTitle>{sectionOne.title}</DocTitle>

    <InfoTable>
      <tbody>
        {(sectionOne.rows || []).map(({ label, value }) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{value || ""}</td>
          </tr>
        ))}
      </tbody>
    </InfoTable>

    <JustTitle>JUSTIFICACION</JustTitle>
    {(sectionOne.justificationParagraphs || []).map((text, i) => (
      <DocParagraph key={i}>{text}</DocParagraph>
    ))}
  </>
);

const SectionTwoBlock = ({ sectionTwo }) => (
  <>
    <LargeSectionTitle>{sectionTwo.title}</LargeSectionTitle>
    <SectionTwoTable>
      <tbody>
        <tr>
          <td className="s2-label">{sectionTwo.label}</td>
          {(sectionTwo.choices || []).map((choice) => (
            <>
              <td key={`lbl-${choice.id}`} className="s2-option">{choice.label}</td>
              <td key={`mrk-${choice.id}`} className="s2-mark">
                {sectionTwo.selectedOption === choice.id ? "X" : ""}
              </td>
            </>
          ))}
        </tr>
      </tbody>
    </SectionTwoTable>
  </>
);

const SectionThreeBlock = ({ sectionThree }) => {
  const columns = sectionThree.columns || [];
  const totalWidth = columns.reduce((s, c) => s + c.width, 0) || 1;

  return (
    <>
      <SectionTitle>{sectionThree.title}</SectionTitle>

      <DataTable>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: `${((col.width / totalWidth) * 100).toFixed(2)}%`,
                  textAlign: col.align || "left",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(sectionThree.rows || []).map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key} style={{ textAlign: col.align || "left" }}>
                  {row[col.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </DataTable>

    </>
  );
};

const SectionFourBlock = ({ sectionFour }) => (
  <>
    <LargeSectionTitle>{sectionFour.title}</LargeSectionTitle>
    {(sectionFour.paragraphs || []).map((text, i) => (
      <DocParagraph key={i}>{text}</DocParagraph>
    ))}
    {sectionFour.subtitle && (
      <LargeSectionTitle>{sectionFour.subtitle}</LargeSectionTitle>
    )}
    {(sectionFour.subtitleParagraphs || []).map((text, i) => (
      <DocParagraph key={i}>{text}</DocParagraph>
    ))}
  </>
);

const SectionFiveBlock = ({ sectionFive }) => {
  const columns = sectionFive.columns || [];
  const totalWidth = columns.reduce((s, c) => s + c.width, 0) || 1;

  return (
    <DataTable>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                width: `${((col.width / totalWidth) * 100).toFixed(2)}%`,
                textAlign: col.align || "left",
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(sectionFive.rows || []).map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.key} style={{ textAlign: col.align || "left" }}>
                {row[col.key] ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
};

export const ClosureDocumentPrint = forwardRef(({ viewModel }, ref) => {
  if (!viewModel) {
    return null;
  }

  return (
    <PrintRoot ref={ref}>
      <SectionOneBlock sectionOne={viewModel.sectionOne} />
      <SectionTwoBlock sectionTwo={viewModel.sectionTwo} />
      <SectionThreeBlock sectionThree={viewModel.sectionThree} />
      <SectionFourBlock sectionFour={viewModel.sectionFour} />
      <SectionFiveBlock sectionFive={viewModel.sectionFive} />
    </PrintRoot>
  );
});

ClosureDocumentPrint.displayName = "ClosureDocumentPrint";