import React from "react";
import type { SceneSlideSchema } from "../schemas/script";
import type { z } from "zod";
import {
  TitleSlide,
  ListSlide,
  StepsSlide,
  ImageTextSlide,
  TableSlide,
  SummarySlide,
  EndingSlide,
  BridgeSlide,
  QuoteSlide,
  DefinitionSlide,
  HighlightSlide,
  TipsSlide,
  WarningSlide,
  ComparisonSlide,
  StatSlide,
  ChecklistSlide,
  BeforeAfterSlide,
  CodeSlide,
  QASlide,
  TwoColumnSlide,
  AgendaSlide,
  GallerySlide,
  ProcessSlide,
  ProfileSlide,
  MetricsSlide,
  IconListSlide,
} from "../components/slides";

type SceneSlide = z.infer<typeof SceneSlideSchema>;

type SlideSelectorProps = {
  slide: SceneSlide;
};

export const SlideSelector: React.FC<SlideSelectorProps> = ({ slide }) => {
  switch (slide.type) {
    case "title":
      return <TitleSlide title={slide.title ?? ""} subtitle={slide.subtitle} />;
    case "list":
      return <ListSlide title={slide.title} items={slide.items} />;
    case "steps":
      return <StepsSlide title={slide.title} items={slide.items} />;
    case "image-text":
      return (
        <ImageTextSlide
          title={slide.title}
          items={slide.items}
          image={slide.image}
        />
      );
    case "table":
      return (
        <TableSlide
          title={slide.title}
          tableHeaders={slide.tableHeaders}
          tableRows={slide.tableRows}
        />
      );
    case "summary":
      return <SummarySlide title={slide.title} items={slide.items} />;
    case "ending":
      return (
        <EndingSlide
          title={slide.title}
          subtitle={slide.subtitle}
          ctaText={slide.ctaText}
        />
      );
    case "bridge":
      return <BridgeSlide title={slide.title} subtitle={slide.subtitle} />;
    case "quote":
      return <QuoteSlide quote={slide.quote} attribution={slide.attribution} />;
    case "definition":
      return <DefinitionSlide title={slide.title} definition={slide.definition} />;
    case "highlight":
      return <HighlightSlide title={slide.title} subtitle={slide.subtitle} />;
    case "tips":
      return <TipsSlide title={slide.title} items={slide.items} />;
    case "warning":
      return <WarningSlide title={slide.title} items={slide.items} />;
    case "comparison":
      return (
        <ComparisonSlide
          title={slide.title}
          leftColumn={slide.leftColumn}
          rightColumn={slide.rightColumn}
        />
      );
    case "stat":
      return (
        <StatSlide
          title={slide.title}
          statValue={slide.statValue}
          statLabel={slide.statLabel}
        />
      );
    case "checklist":
      return <ChecklistSlide title={slide.title} items={slide.items} />;
    case "before-after":
      return (
        <BeforeAfterSlide
          title={slide.title}
          leftColumn={slide.leftColumn}
          rightColumn={slide.rightColumn}
        />
      );
    case "code":
      return (
        <CodeSlide
          title={slide.title}
          code={slide.code}
          language={slide.language}
        />
      );
    case "qa":
      return <QASlide question={slide.question} answer={slide.answer} />;
    case "two-column":
      return (
        <TwoColumnSlide
          title={slide.title}
          leftColumn={slide.leftColumn}
          rightColumn={slide.rightColumn}
        />
      );
    case "agenda":
      return <AgendaSlide title={slide.title} items={slide.items} />;
    case "gallery":
      return <GallerySlide title={slide.title} images={slide.images} />;
    case "process":
      return <ProcessSlide title={slide.title} items={slide.items} />;
    case "profile":
      return (
        <ProfileSlide
          title={slide.title}
          profileImage={slide.profileImage}
          profileName={slide.profileName}
          profileRole={slide.profileRole}
          items={slide.items}
        />
      );
    case "metrics":
      return <MetricsSlide title={slide.title} metrics={slide.metrics} />;
    case "icon-list":
      return <IconListSlide title={slide.title} iconItems={slide.iconItems} />;
    default:
      return null;
  }
};
