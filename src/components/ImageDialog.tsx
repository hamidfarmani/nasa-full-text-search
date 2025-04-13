import {
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Typography,
  Fade,
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import Image from "next/image";
import { ApodData } from "../lib/actions";

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  data: ApodData | null;
}

export function ImageDialog({ open, onClose, data }: ImageDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      slots={{
        transition: Fade,
      }}
      transitionDuration={300}
      slotProps={{
        paper: {
          elevation: 24,
          sx: {
            bgcolor: "background.paper",
            position: "relative",
            minHeight: isMobile ? "40vh" : "70vh",
            maxHeight: "90vh",
            borderRadius: 2,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          position: "relative",
          p: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "black",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            bgcolor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
            },
            zIndex: 2,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          onClick={() => setShowInfo(!showInfo)}
          sx={{
            position: "absolute",
            right: 16,
            top: 72,
            bgcolor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
            },
            zIndex: 2,
            color: "white",
          }}
        >
          <InfoIcon />
        </IconButton>

        <Fade in={!isLoading} timeout={500}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: isMobile ? "40vh" : "70vh",
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  color: "white",
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}
            <Image
              src={data.image_url}
              alt={data.title}
              fill
              priority
              style={{
                objectFit: "contain",
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </Fade>

        {/* Info Panel */}
        <Slide direction="up" in={showInfo} mountOnEnter unmountOnExit>
          <Paper
            elevation={24}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: isTablet ? "60%" : "40%",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              bgcolor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(20px)",
              color: "white",
              p: 3,
              overflowY: "auto",
              zIndex: 1,
              transition: "all 0.3s ease-in-out",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "4px",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.4)",
                },
              },
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                mb: 2,
              }}
            >
              {data.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              {data.explanation}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mt: 3,
                pt: 2,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                Date: {data.date}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {data.authors}
              </Typography>
            </Box>
          </Paper>
        </Slide>
      </DialogContent>
    </Dialog>
  );
}
