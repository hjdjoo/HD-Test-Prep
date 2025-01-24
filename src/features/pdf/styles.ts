import { StyleSheet } from "@react-pdf/renderer";

const vars = {
  primaryDark: "#293c65",
  primary: "#4362a5",
  primaryLight: "#b6c3e2",
  primaryExtralight: "#dbdded",
  offWhite: "#f9f9f0",
  secondaryDark: "#25413e",
  secondary: "#85947e",
  secondaryLight: "#e4e6be",
  secondaryExtralight: "#eff0d7",
}

export const styles = StyleSheet.create({
  page: {
    padding: "0.5in",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.25in",
  },
  heading: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "0.25in",
    fontFamily: "Helvetica-Bold"
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
  },
  sectionSpacing: {
    marginBottom: "0.25in",
  },
  sectionSpacingLg: {
    marginBottom: "0.5in",
  },
  summary: {
    padding: "0.1in",
    backgroundColor: vars.primaryExtralight,
  },
  summaryInfo: {
    padding: "0.1in",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: vars.offWhite,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    marginRight: "0.25in",
  },
  itemName: {
    fontFamily: "Helvetica",
    textDecoration: "underline",
    fontSize: "15",
  },
  itemDetail: {
    fontFamily: "Helvetica",
    fontSize: "15",
  },
  question: {
    display: "flex",
    flexDirection: "row",
  },
  questionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  questionInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  questionInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0.1in",
    fontSize: 14,
  },
  questionInfoDetails: {
    fontSize: 14,
  },
  itemEven: {
    backgroundColor: vars.offWhite
  },
  itemOdd: {
    backgroundColor: vars.primaryExtralight
  },
  image: {
    flexShrink: 1,
    minWidth: "50%",
    objectFit: "scale-down",
  },
  studentWorkImage: {
    flexShrink: 1,
    objectFit: "contain",
  },
  border: {
    border: "1px solid black"
  }
})