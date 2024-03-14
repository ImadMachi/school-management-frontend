// ** React Imports
import { MutableRefObject, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import { Button, Direction } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// ** Third Party Components
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useDispatch } from "react-redux";
import { fetchData } from "src/store/apps/templates";
import { TemplateType } from "src/types/apps/templateTypes";

const ThumbnailPlugin = (
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin => {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(next);
      });
    });
  };
};

const SwiperThumbnails = ({
  direction,
  templates,
  handleSelectTemplate,
}: {
  direction: Direction;
  templates: TemplateType[];
  handleSelectTemplate: (template: TemplateType) => void;
}) => {
  // ** Hooks
  const theme = useTheme();
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === "rtl",
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      rtl: direction === "rtl",
      slides: {
        perView: 4,
        spacing: 16,
      },
      breakpoints: {
        [`(max-width: ${theme.breakpoints.values.sm}px)`]: {
          slides: {
            perView: 3,
            spacing: 8,
          },
        },
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        alignItems: "center",
      }}
      ref={thumbnailRef}
      className="keen-slider thumbnail"
    >
      {templates.map((template) => (
        <Box
          key={template.id}
          className="keen-slider__slide"
          sx={{ cursor: "pointer", display: "inline" }}
        >
          <Button
            sx={{
              p: 0,
              borderRadius: 1,
              overflow: "hidden",
              margin: "0 10px 5px",
              padding: "5px",
              border: "1px solid " + theme.palette.primary.dark,
              color: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
              },
              fontSize: "0.75rem",
            }}
            onClick={() => handleSelectTemplate(template)}
          >
            {template.title}
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default SwiperThumbnails;
