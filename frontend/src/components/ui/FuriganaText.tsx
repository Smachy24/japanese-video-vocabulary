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
      {tokens.map((token, index) =>
        containsKanji(token.surface) && token.readingSurfaceHiragana ? (
          <ruby key={index}>
            {token.surface}
            <rt>{token.readingSurfaceHiragana}</rt>
          </ruby>
        ) : (
          <span key={index}>{token.surface}</span>
        )
      )}
    </span>
  );
};
