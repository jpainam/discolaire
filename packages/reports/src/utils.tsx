/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
import rehypeParse from "rehype-parse";
import { unified } from "unified";

export function flatten({ values }: { values: any }) {
  const styles = Array.isArray(values) ? values : [values];

  const mergeStyles = styles.reduce((acc, style) => {
    const s = Array.isArray(style) ? flatten(style) : style;
    Object.keys(s).forEach((key) => {
      if (s[key] !== null && s[key] !== undefined) {
        acc[key] = s[key];
      }
    });
    return acc;
  }, {});
  return mergeStyles;
}

export function getCdnUrl() {
  if (process.env.NODE_ENV == "production") {
    return "https://discolaire-public.s3.eu-central-1.amazonaws.com";
  }
  return "http://localhost:3000";
}

export function getAppreciations(grade?: number | null) {
  if (grade === undefined || grade == null) return "";
  if (grade >= 0 && grade < 4) {
    return "Nul";
  } else if (grade >= 4 && grade < 6) {
    return "Très faible";
  } else if (grade >= 6 && grade < 8) {
    return "Faible";
  } else if (grade >= 8 && grade < 9) {
    return "Insuffisant";
  } else if (grade >= 9 && grade < 10) {
    return "Médiocre";
  } else if (grade >= 10 && grade < 11) {
    return "Moyen";
  } else if (grade >= 11 && grade < 12) {
    return "Passable";
  } else if (grade >= 12 && grade < 14) {
    return "Assez bien";
  } else if (grade >= 14 && grade < 16) {
    return "Bien";
  } else if (grade >= 16 && grade < 18) {
    return "Très bien";
  } else if (grade >= 18 && grade <= 20) {
    return "Excellent";
  }
  return "Pas definie";
}
// Define styles
const styles = StyleSheet.create({
  paragraph: { marginBottom: 4 },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },
  heading1: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  heading2: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  list: { marginLeft: 10 },
  listItem: { marginBottom: 2 },
});

export const renderHtml = (html: string) => {
  const hastTree = unified().use(rehypeParse, { fragment: true }).parse(html);

  return toJsxRuntime(hastTree, {
    Fragment,
    jsx,
    jsxs,
    jsxDEV: jsx, // Add jsxDEV for development mode
    components: {
      p: (props: any) => (
        <Text style={styles.paragraph}>{props?.children ?? null}</Text>
      ),
      strong: (props: any) => (
        <Text style={styles.bold}>{props?.children ?? null}</Text>
      ),
      b: (props: any) => (
        <Text style={styles.bold}>{props?.children ?? null}</Text>
      ),
      i: (props: any) => (
        <Text style={styles.italic}>{props?.children ?? null}</Text>
      ),
      em: (props: any) => (
        <Text style={styles.italic}>{props?.children ?? null}</Text>
      ),
      u: (props: any) => (
        <Text style={styles.underline}>{props?.children ?? null}</Text>
      ),
      h1: (props: any) => (
        <Text style={styles.heading1}>{props?.children ?? null}</Text>
      ),
      h2: (props: any) => (
        <Text style={styles.heading2}>{props?.children ?? null}</Text>
      ),
      br: () => <Text>{"\n"}</Text>,
      ul: (props: any) => (
        <View style={styles.list}>{props?.children ?? null}</View>
      ),
      li: (props: any) => (
        <Text style={styles.listItem}>{props?.children ?? null}</Text>
      ),
    },
    elementAttributeNameCase: "html",
    development: process.env.NODE_ENV !== "production",
  });
};
