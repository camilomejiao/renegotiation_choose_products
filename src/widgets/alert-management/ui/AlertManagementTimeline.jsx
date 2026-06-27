import {
  DetailSectionCard, DetailSectionTitle, DetailTimeline,
  DetailTimelineItem, DetailTimelineMeta, DetailTimelineTitle,
} from "./detail.styles";

export const AlertManagementTimeline = ({ items }) => (
  <DetailSectionCard bordered={false}>
    <DetailSectionTitle>Traza de eventos</DetailSectionTitle>
    <DetailTimeline>
      {items.map((item) => (
        <DetailTimelineItem key={item.id} $tone={item.tone}>
          <DetailTimelineTitle>{item.title}</DetailTimelineTitle>
          <DetailTimelineMeta>{item.meta}</DetailTimelineMeta>
        </DetailTimelineItem>
      ))}
    </DetailTimeline>
  </DetailSectionCard>
);