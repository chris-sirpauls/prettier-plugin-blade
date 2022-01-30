import { LexerOld } from "../src/lang/lexerOld";
import { Token, TokenType } from "../src/lang/token";

const lex = (source: string): Token[] => {
    return new LexerOld(source).all();
};

it("can generate directive tokens", () => {
    const tokens = lex(
        "@php @if(true) @else() @if  (true) @if(auth()) @if(')' === '@test')"
    ).filter((token) => token.type !== TokenType.Literal && !!token.raw.trim());

    expect(tokens[0]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[0]).toHaveProperty("raw", "@php");

    expect(tokens[1]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[1]).toHaveProperty("raw", "@if(true)");

    expect(tokens[2]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[2]).toHaveProperty("raw", "@else()");

    expect(tokens[3]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[3]).toHaveProperty("raw", "@if  (true)");

    expect(tokens[4]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[4]).toHaveProperty("raw", "@if(auth())");

    expect(tokens[5]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[5]).toHaveProperty("raw", "@if(auth()) @if(')' === '@test')");

    expect(tokens).toHaveLength(6);
});

it("can generate comment tokens", () => {
    const raw = lex("{{-- $test --}}")[0];

    expect(raw).toHaveProperty("type", TokenType.Comment);
    expect(raw).toHaveProperty("raw", "{{-- $test --}}");

    const spaceless = lex("{{--$test--}}")[0];

    expect(spaceless).toHaveProperty("type", TokenType.Comment);
    expect(spaceless).toHaveProperty("raw", "{{--$test--}}");
});

it("should parse directive if ended with space", function () {
    const tokens = lex("@csrf ");

    expect(tokens).toHaveLength(1);

    expect(tokens[0]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[0]).toHaveProperty("raw", "@csrf");
});

it("should parse multiple no args directives", function () {
    const tokens = lex("@csrf is good @csrf");

    expect(tokens).toHaveLength(3);

    expect(tokens[0]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[0]).toHaveProperty("raw", "@csrf");

    expect(tokens[1]).toHaveProperty("type", TokenType.Literal);
    expect(tokens[1]).toHaveProperty("raw", " is good ");

    expect(tokens[2]).toHaveProperty("type", TokenType.Directive);
    expect(tokens[2]).toHaveProperty("raw", "@csrf");
});



