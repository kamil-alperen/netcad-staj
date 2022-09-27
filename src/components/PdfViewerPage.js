import React from "react";
import {codesAndFiles} from "./PdfFilePage";
// Core viewer
import { Viewer, Worker } from '@react-pdf-viewer/core';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';




export default () => {
    // Create new plugin instance
    const URL = window.location.href;
    const params = URL.substring(URL.indexOf("?")+1).split("&");
    console.log(params);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
            <Viewer
                fileUrl={""}
                plugins={[
                    // Register plugins
                    defaultLayoutPluginInstance,
                ]}
            />
        </Worker>
    )
}