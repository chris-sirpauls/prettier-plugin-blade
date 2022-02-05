import { Parser } from "./Parser";
import {
    BladeCstChildren,
    CommentCstChildren,
    ContentCstChildren,
    DirectiveCstChildren,
    EchoCstChildren,
    EndDirectiveCstChildren,
    EscapedEchoCstChildren,
    EscapedRawEchoCstChildren,
    ICstNodeVisitor,
    LiteralCstChildren,
    PairDirectiveCstChildren,
    RawEchoCstChildren,
} from "./blade_cst";
import {
    CommentNode,
    DirectiveNode,
    DirectivePairNode,
    DocumentNode,
    EchoNode,
    EchoType,
    LiteralNode,
    Node,
} from "./nodes";

const BaseBladeVisitor = Parser.getBaseCstVisitorConstructor();

export class BladeToAstVisitor
    extends BaseBladeVisitor
    implements ICstNodeVisitor<any, Node>
{
    constructor() {
        super();
        this.validateVisitor();
    }

    blade(cst: BladeCstChildren, param?: any): DocumentNode {
        const contents = cst.content?.map((element) => {
            return this.visit(element) as Node;
        });

        return new DocumentNode(contents ?? []);
    }

    content(children: ContentCstChildren, param?: any): Node {
        const child =
            children.literal ??
            children.directive ??
            children.echo ??
            children.rawEcho ??
            children.comment ??
            children.escapedEcho ??
            children.escapedRawEcho ??
            children.pairDirective;

        if (child === undefined) {
            throw new Error("Content should always have at least 1 child.");
        }

        return this.visit(child);
    }

    comment(children: CommentCstChildren, param?: any): CommentNode {
        const content = children.Comment[0].image;

        return new CommentNode(
            content,
            content.substring(4, content.length - 4)
        );
    }

    directive(children: DirectiveCstChildren, param?: any): DirectiveNode {
        const content = children.Directive[0].image;

        let directiveName = content.substring(content.indexOf("@") + 1);

        if (directiveName.includes("(")) {
            directiveName = directiveName.substring(
                0,
                directiveName.indexOf("(")
            );
        }
        directiveName = directiveName.trim();

        let inner = content.replace("@" + directiveName, "").trim();
        if (inner.startsWith("(")) {
            inner = inner.substring(1);
        }

        if (inner.endsWith(")")) {
            inner = inner.substring(0, inner.length - 1);
        }

        return new DirectiveNode(content, directiveName, inner);
    }

    echo(children: EchoCstChildren, param?: any): EchoNode {
        const content = children.Echo[0].image;

        return new EchoNode(
            content,
            content.substring(2, content.length - 2),
            EchoType.Escaped
        );
    }

    literal(children: LiteralCstChildren, param?: any): LiteralNode {
        const content = children.Literal.map((literal) => {
            return literal.image;
        }).join("");

        return new LiteralNode(content);
    }

    rawEcho(children: RawEchoCstChildren, param?: any): EchoNode {
        const content = children.RawEcho[0].image;

        return new EchoNode(
            content,
            content.substring(3, content.length - 3),
            EchoType.Raw
        );
    }

    escapedEcho(children: EscapedEchoCstChildren, param?: any): Node {
        const content = children.EscapedEcho[0].image;

        return new LiteralNode(content);
    }

    escapedRawEcho(children: EscapedRawEchoCstChildren, param?: any): Node {
        const content = children.EscapedRawEcho[0].image;

        return new LiteralNode(content);
    }

    pairDirective(children: PairDirectiveCstChildren, param?: any): Node {
        const openDirective = this.visit(children.startDirective);
        const closeDirective = this.visit(children.endDirective);
        const content = children.content?.map((content: any) => {
            return this.visit(content);
        });

        return new DirectivePairNode(
            openDirective,
            closeDirective,
            content ?? []
        );
    }

    endDirective(children: EndDirectiveCstChildren, param?: any): Node {
        return this.directive({ Directive: children.EndDirective }, param);
    }
}

export const bladeToAstVisitor = new BladeToAstVisitor();
