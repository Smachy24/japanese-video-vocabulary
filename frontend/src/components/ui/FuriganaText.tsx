import type { Token } from "../../types/token";
import type { FunctionComponent } from "../../common/types";

type Props = {
  tokens: Array<Token>;
};

function containsKanji(text: string): boolean {
  return /[一-龯㐀-䶿]/u.test(text);
}

export const FuriganaText = ({ tokens }: Props): FunctionComponent => {
  return (
    <span>
      {tokens.map((token, i) =>
        containsKanji(token.surface) && token.readingSurfaceHiragana ? (
          <ruby key={i}>
            {token.surface}
            <rt>{token.readingSurfaceHiragana}</rt>
          </ruby>
        ) : (
          <span key={i}>{token.surface}</span>
        )
      )}
    </span>
  );
};
