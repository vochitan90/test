if (window.addEventListener) {
  window.addEventListener(
    "message",
    (evt) => {
      const key = evt.message ? "message" : "data";
      let dataTemp = evt[key];
      if (!dataTemp) {
        return;
      }
      try {
        if (window.checkIsString(dataTemp)) {
          dataTemp = JSON.parse(dataTemp);
        }
        if (dataTemp.action === ACTION_EVENT_PDFTRON.CHANGE_FILE) {
          setTimeout(() => {
            dataMessage = dataTemp.fileData;
            PERMISSION = dataTemp.PERMISSION;
            TYPE_ACTION = dataTemp.TYPE_ACTION;
            window.downloadDocument(dataMessage, false);
          }, 0);
        } else if (dataTemp.action === ACTION_EVENT_PDFTRON.LOAD_FILE) {
          if (IS_LOAD_FILE_COMPLETE) {
            return;
          }
          window.fireEventToParent(JSON.stringify({
            'action': ACTION_EVENT_PDFTRON.RECEIVE_FILE_COMPLETE
          }), '*');
          dataMessage = dataTemp.fileData;
          UPLOAD_PUBLISH_DOC_TEPM = dataTemp.UPLOAD_PUBLISH_DOC_TEPM;
          DOWNLOAD_PUBLISH_DOC_TEMP = dataTemp.DOWNLOAD_PUBLISH_DOC_TEMP;
          GET_RECEIVER_ATTACT_DETAIL = dataTemp.GET_RECEIVER_ATTACT_DETAIL;
          PERMISSION = dataTemp.PERMISSION;
          TYPE_ACTION = dataTemp.TYPE_ACTION;
          IS_LOAD_FILE_COMPLETE = true;
          setTimeout(() => {
            window.downloadDocument(dataMessage, false);
          }, 100);
        }
      } catch (error) {
        console.log(' error ', error);
      }
    },
    false
  );
} else {
  window.attachEvent("onmessage", (evt) => {
    const key = evt.message ? "message" : "data";
    let dataTemp = evt[key];
    if (!dataTemp) {
      return;
    }
    if (dataTemp.action === "change-file") {
      setTimeout(() => {
        dataMessage = dataTemp.fileData;
        window.downloadDocument(dataMessage, false);
      }, 0);
    }
  });
}
window.onload = function (e) {
  setTimeout(() => {
    if (window.isHideModal()) {
      if (dataMessage && wvInstance && !IS_LOAD_FILE_COMPLETE) {
        window.downloadDocument(dataMessage, false);
      } else {
        window.fireEventToParent(JSON.stringify({
          'action': ACTION_EVENT_PDFTRON.LOAD_FILE_AGAIN
        }), '*');
      }
    }
  }, 15000);
}
WebViewer({
    path: _PATH,
    initialDoc: _initialDoc,
    // initialDoc: _initialDoc,
    fullAPI: false,
    ui: 'legacy',
    enableRedaction: true,
  },
  document.getElementById("viewer")
).then(async (instance) => {
  // samplesSetup(instance);
  // wvInstance = instance;
  // docViewer = instance.docViewer;
  // annotManager = instance.annotManager;
  //  = instance.Annotations;

  window.documentViewer = instance;
  window.samplesSetup(instance);
  const {
    docViewer,
    annotManager,
    annotations
  } = instance;
  window.instancePDF = instance;
  window.docViewer = docViewer;
  window.annotManager = annotManager;
  window.annotations = annotations;

  docViewer.on("pageComplete", async () => {
    window.hideModal();
    // const annotations = docViewer.getAnnotationManager().getAnnotationsList();
    // let isHaveSignature = false;
    // annotations.forEach((annot) => {
    //   if (annot.Subject === 'Signature') {
    //     annot.Listable = false;
    //     isHaveSignature = true;
    //   }
    // });
    // setTimeout(() => {
    //   if (TYPE_ACTION === ACTION_EVENT_PDFTRON.POP_UP && isHaveSignature) {
    //     window.hideAllButtonEsgin(false);
    //   } else {
    //     window.hideButtonUpload(PERMISSION);
    //   }
    // }, 300);
  });
  docViewer.on("documentLoaded", async () => {
    if (!isFirstLoad) {
      return;
    }
    isFirstLoad = false;
    this.addDownloadButton();
    this.addDragDrop();
    COUNT_INTERVAL = 0;
  });
});

function downloadDocumentChild(path) {
  const urlDownload = DOWNLOAD_PUBLISH_DOC_TEMP;
  let filePath = path;
  const data = `path=${encodeURIComponent(filePath.filePathDownload)}`;
  axios
    .post(urlDownload, data, {
      responseType: "blob",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset:UTF-8",
      },
    })
    .then((response) => {
      if (response) {
        if (response.status === 200) {
          window.hideModal();
          window.documentViewer.loadDocument(response.data, {
            filename: filePath.fileName,
          });
        } else {
          window.hideModal();
          window.showMessage('Không thể lấy thông tin file');
        }
      }
      COUNT_INTERVAL = 10;
      IS_LOAD_FILE_COMPLETE = true;
    })
    .catch((err) => {
      window.hideModal();
      IS_LOAD_FILE_COMPLETE = true;
    });
}

function downloadDocument(path, isFirstEnter) {
  if (window.documentViewer) {
    window.downloadDocumentChild(path);
    return;
  }
  let interval = setInterval(() => {
    if (COUNT_INTERVAL === 10) {
      if (window.documentViewer) {
        window.downloadDocumentChild(path);
      }
      clearInterval(interval);
      return;
    }
    if (window.documentViewer) {
      window.downloadDocumentChild(path);
      clearInterval(interval);
      return;
    }
    COUNT_INTERVAL++;
  }, 500);
}


function addDownloadButton() {
  PERMISSION = {isUpload : true }
  if (PERMISSION)
    if (PERMISSION.isUpload) {
      window.instancePDF.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: "../../assets/upload.svg",
          id: 'btnUpload',
          dataElement: 'actionButton2222',
          onClick: async () => {
            if (!window.isHaveSignatureElectric()) {
              window.showMessage('Vui lòng nhập chữ ký', 'error');
              return;
            }
            await saveDocument();
            // await viewerWindow.convertAnnotToFormField();
            // const xfdfString = await window.annotManager.exportAnnotations();
            // const data = await window.docViewer.getDocument().getFileData({
            //   xfdfString,
            //   // flatten: true
            // });
            // const arr = new Uint8Array(data);
            // const blob = new Blob([arr], {
            //   type: "application/pdf",
            // });
            // window.uploadFile(blob);
          },
        });
      });
    }
  if (window.isShowSignUSB()) {
    window.instancePDF.setHeaderItems((header) => {
      header.push({
        type: "actionButton",
        id: 'btnAddSign',
        img: "../../assets/sign.svg",
        onClick: async () => {
          document.getElementById("Add").click();
        },
      });
    });

    window.instancePDF.setHeaderItems((header) => {
      header.push({
        type: "actionButton",
        id: 'btnSign',
        img: "../../assets/document-signing.svg",
        onClick: async () => {
          await viewerWindow.convertAnnotToFormField();
          const xfdfString = await window.annotManager.exportAnnotations();
          runDigitalSignaturesTest(
            new Uint8Array(
              await docViewer.getDocument().getFileData({
                xfdfString,
                flatten: true
              })
            )
          );
        },
      });
    });
  }
}


function uploadFile(file) {
  swal({
      title: "Bạn muốn hoàn tất thao tác ký",
      text: "Vui lòng nhấn Đồng ý để hoàn tất thao tác ",
      buttons: true,
      dangerMode: true,
      buttons: ["Hủy bỏ", "Đồng ý"],
    })
    .then((willDelete) => {
      if (willDelete) {

        window.showModal();
        const formData = new FormData();
        const fileName = encodeURIComponent(dataMessage.fileName);

        formData.append("file", file, fileName);
        const params = {
          filePath: dataMessage.filePathDownload,
          receiverId: dataMessage.receiverId,
          attachmentId: dataMessage.attachmentId
        };
        formData.append("params", encodeURI(JSON.stringify(params)));
        const urlUpload = UPLOAD_PUBLISH_DOC_TEPM;
        axios
          .post(urlUpload, formData, {
            headers: {
              "content-type": "multipart/form-data",
              authorization: "Bearer " + sessionStorage.getItem("Authorization"),
              filename: fileName,
            },
          })
          .then((response) => {
            if (response) {
              if (response.status === 200) {
                const message = response.data.message;
                if (response.data && response.data.status === "SUCCESS") {
                  if (message) {
                    window.showMessage(message);
                  } else {
                    window.showMessage('Upload thành công');
                  }
                  window.hideAllButtonEsgin(false);
                  window.fireEventToParent(JSON.stringify({
                    'action': ACTION_EVENT_PDFTRON.CHANGE_CONTENT_FILE
                  }), '*');
                } else {
                  if (message) {
                    window.showMessage(message, 'error');
                  } else {
                    window.showMessage('Upload thất bại', 'error');
                  }
                }
              }
            }

            window.hideModal();
          }).catch((err) => {
            window.showMessage('Upload thất bại', 'error');
            window.hideModal();
          });
      } else {
        // swal("Your imaginary file is safe!");
      }
    });
}


function isHaveSignatureElectric() {
  if (window.docViewer) {
    const annotationsList = docViewer.getAnnotationManager().getAnnotationsList();
    if (!Array.isArray(annotationsList) || annotationsList.length === 0) {
      return false;
    }
    // let isHave = false;
    let count = annotationsList.length;
    for (const annotation of annotationsList) {
      if (annotation.Subject === 'Signature' && annotation.Listable === false) {
        // return isHave;
        count--;
      }
    }
    // Tat ca cac annotion deu da dc ky --> chua co chu ky moi
    if (count === 0) {
      return false;
    }
    return true;
  }
  return false;
}


addDragDrop = () => {
  let dropPoint = {};
  const {
    docViewer,
    Annotations,
    annotManager,
    iframeWindow
  } = window.instancePDF;
  const fieldManager = annotManager.getFieldManager();

  iframeWindow.convertAnnotToFormField = () => {
    const annotationsList = annotManager.getAnnotationsList();
    const annotsToDelete = [];
    const annotsToDraw = [];

    annotationsList.forEach((annot, index) => {
      let inputAnnot;
      let field;
      if (annot.getCustomData("type") !== "") {
        // set readonly flag if necessary
        const flags = new Annotations.WidgetFlags();
        if (annot.getCustomData("flag").readOnly) {
          flags.set("ReadOnly", true);
        }
        if (annot.getCustomData("flag").multiline) {
          flags.set("Multiline", true);
        }

        // add it to clean up placeholder annots
        annotsToDelete.push(annot);

        // create a form field based on the type of annotation
        if (annot.getCustomData("type") === "TEXT") {
          field = new Annotations.Forms.Field(
            annot.getContents() + Date.now() + index, {
              type: "Tx",
              value: annot.getCustomData("value"),
              flags,
            }
          );
          inputAnnot = new Annotations.TextWidgetAnnotation(field);
        } else if (annot.getCustomData("type") === "SIGNATURE") {
          field = new Annotations.Forms.Field(
            annot.getContents() + Date.now() + index, {
              type: "Sig",
              flags,
            }
          );
          inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
            appearance: "_DEFAULT",
            appearances: {
              _DEFAULT: {
                Normal: {
                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                  offset: {
                    x: 100,
                    y: 100,
                  },
                },
              },
            },
          });
        } else if (annot.getCustomData("type") === "CHECK") {
          flags.set("Edit", true);
          const font = new Annotations.Font({
            name: "Helvetica",
          });
          field = new Annotations.Forms.Field(
            annot.getContents() + Date.now() + index, {
              type: "Btn",
              value: "Off",
              flags,
              font,
            }
          );
          inputAnnot = new Annotations.CheckButtonWidgetAnnotation(field, {
            appearance: "Off",
            appearances: {
              Off: {},
              Yes: {},
            },
          });
        } else {
          // exit early for other annotations
          annotManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
          return;
        }
      } else {
        return;
      }

      // set flag and position
      inputAnnot.PageNumber = annot.getPageNumber();
      inputAnnot.X = annot.getX();
      inputAnnot.Y = annot.getY();
      inputAnnot.rotation = annot.Rotation;
      if (annot.Rotation === 0 || annot.Rotation === 180) {
        inputAnnot.Width = annot.getWidth();
        inputAnnot.Height = annot.getHeight();
      } else {
        inputAnnot.Width = annot.getHeight();
        inputAnnot.Height = annot.getWidth();
      }

      // customize styles of the form field
      Annotations.WidgetAnnotation.getCustomStyles = (widget) => {
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          return {
            "background-color": "#a5c7ff",
            color: "white",
            "font-size": "20px",
          };
        }

        if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {
            border: "1px solid #a5c7ff",
          };
        }
      };
      Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

      annotManager.addAnnotation(inputAnnot);
      fieldManager.addField(field);
      annotsToDraw.push(inputAnnot);
    });

    annotManager.deleteAnnotations(annotsToDelete, null, true);

    return annotManager.drawAnnotationsFromList(annotsToDraw).then(() => {
      dropPoint = {};
    });
  };

  // adding the annotation which later will be converted to form fields
  iframeWindow.addFormFieldAnnot = (type, name, value, flag) => {
    const zoom = docViewer.getZoom();
    const doc = docViewer.getDocument();
    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(dropPoint, dropPoint);
    if (!!dropPoint.x && page.first == null) {
      return; // don't add field to an invalid page location
    }
    const pageIdx =
      page.first !== null ? page.first : docViewer.getCurrentPage() - 1;
    const pageInfo = doc.getPageInfo(pageIdx);
    const pagePoint = displayMode.windowToPage(dropPoint, pageIdx);

    const textAnnot = new Annotations.FreeTextAnnotation();
    textAnnot.PageNumber = pageIdx + 1;
    const rotation = docViewer.getCompleteRotation(pageIdx + 1) * 90;
    textAnnot.Rotation = rotation;
    if (type === "CHECK") {
      textAnnot.Width = 25 / zoom;
      textAnnot.Height = 25 / zoom;
    } else if (rotation === 270 || rotation === 90) {
      textAnnot.Width = 50 / zoom;
      textAnnot.Height = 250 / zoom;
    } else {
      textAnnot.Width = 250 / zoom;
      textAnnot.Height = 50 / zoom;
    }
    textAnnot.X = (pagePoint.x || pageInfo.width / 2) - textAnnot.Width / 2;
    textAnnot.Y = (pagePoint.y || pageInfo.height / 2) - textAnnot.Height / 2;

    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
    textAnnot.setCustomData("type", type);
    textAnnot.setCustomData("value", value);
    textAnnot.setCustomData("flag", flag);

    // set the type of annot
    textAnnot.setContents(`${name}_${type}`);
    textAnnot.FontSize = `${10.0 / zoom}px`;
    textAnnot.FillColor = new Annotations.Color(211, 211, 211, 0.5);
    textAnnot.TextColor = new Annotations.Color(0, 165, 228);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(0, 165, 228);
    textAnnot.TextAlign = "center";
    textAnnot.Author = annotManager.getCurrentUser();

    annotManager.deselectAllAnnotations();
    annotManager.addAnnotation(textAnnot, true);
    annotManager.redrawAnnotation(textAnnot);
    annotManager.selectAnnotation(textAnnot);
    dropPoint = {};
  };

  iframeWindow.setDropPoint = (dropPt) => {
    dropPoint = {
      x: dropPt.x,
      y: dropPt.y,
    };
  };
};


// WebViewer({
//     path: '../lib',
//     initialDoc: 'files/demo.pdf',
//     ui: 'legacy',
//     enableRedaction: true,
//   },
//   document.getElementById('viewer')
// ).then(instance => {

//   window.documentViewer = instance;
//   window.samplesSetup(instance);
//   const {
//     docViewer, annotManager 
//   } = instance;
//   window.instancePDF = instance;
//   window.docViewer = docViewer;
//   window.annotManager = annotManager;
// });