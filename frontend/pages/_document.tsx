import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="mn">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="application-name" content="The Sol" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="The Sol" />
          <meta name="description" content="The Sol" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-tap-highlight" content="no" />
          <link rel="shortcut icon" href="/favicon-32x32.png" />
          <link rel="mask-icon" color="#000000" href="/apple-icon-60x60.png" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="2048x2732"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="1668x2224"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="1536x2048"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="1125x2436"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="1242x2208"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="750x1334"
          />
          <link
            rel="apple-touch-startup-image"
            href="/android-icon-192x192.png"
            sizes="640x1136"
          />
          <meta name="theme-color" content="#ffffff" />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
          <meta charSet="UTF-8" />
          <meta name="geo.placename" content="Ulaanbaatar" />
          <meta name="geo.region" content="MN" />
          <meta name="geo.position" content="47.9165601; 106.9125629" />
          <meta name="description" content="University" />
          <meta name="author" content="Uurtsaikh Nyambat" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body style={{ minHeight: "100vh", minWidth: "100vw" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
