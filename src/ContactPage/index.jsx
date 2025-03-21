import React from "react";
import { Box, Typography, Container, Card, CardContent } from "@mui/material";

export default function ContactPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Contact
            </Typography>

            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              This application was developed by:
            </Typography>

            <Typography variant="h6" align="center" sx={{ mt: 1 }}>
              Siren Wang, Hongyuan Xu, Yuyang Pan
            </Typography>

            <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
              Affiliated with Northwestern University
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
