// @flow
// Horizontal overlap functions
import defineFunction from "../defineFunction";
import {makeSpan} from "../buildCommon";
import mathMLTree from "../mathMLTree";

import * as html from "../buildHTML";
import * as mml from "../buildMathML";

defineFunction({
    type: "lap",
    names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
    props: {
        numArgs: 1,
        allowedInText: true,
    },
    handler: (context, args) => {
        const body = args[0];
        return {
            type: "lap",
            alignment: context.funcName.slice(5),
            body: body,
        };
    },
    htmlBuilder: (group, options) => {
        // mathllap, mathrlap, mathclap
        let inner;
        if (group.value.alignment === "clap") {
            // ref: https://www.math.lsu.edu/~aperlis/publications/mathclap/
            inner = makeSpan([], [html.buildGroup(group.value.body, options)]);
            // wrap, since CSS will center a .clap > .inner > span
            inner = makeSpan(["inner"], [inner], options);
        } else {
            inner = makeSpan(
                ["inner"], [html.buildGroup(group.value.body, options)]);
        }
        const fix = makeSpan(["fix"], []);
        return makeSpan(
            ["mord", group.value.alignment], [inner, fix], options);
    },
    mathmlBuilder: (group, options) => {
        // mathllap, mathrlap, mathclap
        const node = new mathMLTree.MathNode(
            "mpadded", [mml.buildGroup(group.value.body, options)]);

        if (group.value.alignment !== "rlap")    {
            const offset = (group.value.alignment === "llap" ? "-1" : "-0.5");
            node.setAttribute("lspace", offset + "width");
        }
        node.setAttribute("width", "0px");

        return node;
    },
});
