import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ current, initialValue, height }) => {
  return (
    <div className="mt-5">
      <Editor
        apiKey="09ki2fwskph5jnq8sg8t19u4u84hosicu07j73ckr2n5sja2"
        onInit={(evt, editor) => (current.current = editor)}
        initialValue={initialValue}
        init={{
          height: height || 650,
          menu: {
            file: {
              title: "File",
              items:
                "newdocument restoredraft | preview | export print | deleteallconversations",
            },
            edit: {
              title: "Edit",
              items:
                "undo redo | cut copy paste pastetext | selectall | searchreplace",
            },
            view: {
              title: "View",
              items:
                "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
            },
            insert: {
              title: "Insert",
              items:
                "image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
            },
            format: {
              title: "Format",
              items:
                "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat",
            },
            tools: {
              title: "Tools",
              items:
                "spellchecker spellcheckerlanguage | a11ycheck code wordcount",
            },
            table: {
              title: "Table",
              items:
                "inserttable | cell row column | advtablesort | tableprops deletetable",
            },
            help: { title: "Help", items: "help" },
          },
          plugins: ["link"],
          mobile: {
            menubar: true,
            plugins: "autosave lists autolink",
            toolbar: "undo bold italic styles",
          },
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
};

export default TextEditor;
