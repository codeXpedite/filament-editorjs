import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Underline from "@editorjs/underline";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import RawTool from "@editorjs/raw";
import Delimiter from "@editorjs/delimiter";
import { StyleInlineTool } from "editorjs-style";
import DragDrop from "editorjs-drag-drop";

document.addEventListener("alpine:init", () => {
    Alpine.data(
        "editorjs",
        ({ state, statePath, placeholder, readOnly, tools, minHeight }) => ({
            instance: null,
            state: state,
            tools: tools,
            init() {
                const uploadImage = async (blob) => {
                    return new Promise((resolve, reject) => {
                        // Use Livewire's upload method
                        this.$wire.upload(
                            `${statePath}_temp_file`, // Unique property name for temporary upload
                            blob,
                            (uploadedFilename) => {
                                // On successful upload, call a Livewire action to process the temporary file
                                this.$wire.call('processEditorJsImageUpload', statePath, uploadedFilename)
                                    .then(result => {
                                        if (result.success) {
                                            resolve(result); // Resolve with { success: 1, file: { url: '...', media_id: ... } }
                                        } else {
                                            reject('Upload processing failed');
                                        }
                                    })
                                    .catch(error => reject(error));
                            },
                            () => { // Error callback
                                reject('Upload failed');
                            },
                            (event) => { // Progress callback (optional)
                                // console.log('Upload progress:', event.detail.progress);
                            }
                        );
                    });
                };

                let enabledTools = {};

                if (this.tools.includes("header")) {
                    enabledTools.header = {
                        class: Header,
                        inlineToolbar: true,
                    };
                }
                if (this.tools.includes("image")) {
                    enabledTools.image = {
                        class: ImageTool,
                        config: {
                            uploader: {
                                uploadByFile: uploadImage,
                                uploadByUrl: async (url) => {
                                    // Re-use the uploadByFile logic after fetching the blob
                                    try {
                                        const res = await fetch(url);
                                        const blob = await res.blob();
                                        // Ensure the uploadImage promise resolves/rejects correctly here
                                        return await uploadImage(blob);
                                    } catch (error) {
                                        console.error('Error uploading by URL:', error);
                                        return {
                                            success: 0,
                                        };
                                    }
                                },
                            },
                        },
                    };
                }
                if (this.tools.includes("delimiter"))
                    enabledTools.delimiter = Delimiter;
                if (this.tools.includes("list")) {
                    enabledTools.list = {
                        class: List,
                        inlineToolbar: true,
                    };
                }
                if (this.tools.includes("underline"))
                    enabledTools.underline = Underline;
                if (this.tools.includes("quote")) {
                    enabledTools.quote = {
                        class: Quote,
                        inlineToolbar: true,
                    };
                }
                if (this.tools.includes("table")) {
                    enabledTools.table = {
                        class: Table,
                        inlineToolbar: true,
                    };
                }
                if (this.tools.includes("raw")) enabledTools.raw = RawTool;
                if (this.tools.includes("code")) enabledTools.code = Code;
                if (this.tools.includes("inline-code"))
                    enabledTools.inlineCode = InlineCode;
                if (this.tools.includes("style")) enabledTools.style = StyleInlineTool;
                this.instance = new EditorJS({
                    holder: this.$el,
                    minHeight: minHeight,
                    data: this.state,
                    placeholder: placeholder,
                    readOnly: readOnly,
                    tools: enabledTools,

                    onChange: () => {
                        this.instance.save().then((outputData) => {
                            this.state = outputData;
                        });
                    },
                    onReady: () => {
                        new DragDrop(this.instance);
                    },
                });
            },
        })
    );
});
