<?xml version="1.0" encoding="UTF-8"?>
<lexicon version="1.0"
    xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.w3.org/2005/01/pronunciation-lexicon http://www.w3.org/TR/2007/CR-pronunciation-lexicon-20071212/pls.xsd"
    alphabet="ipa" xml:lang="en-US">
  <!-- generate-tts.mjs posts via add-from-rules. Phonemes require eleven_flash_v2 or eleven_v3. -->
  <!-- HELUT is “HELL-yoot” (stylized HELÜT): short e, then the y-glide.
       Confirmed by ear 2026-09-03. An earlier reading of the author's gloss
       ("he as in he/him") as the long /iː/ vowel was wrong.

       DIAGNOSIS — why this is an alias and not IPA. Every IPA entry that failed
       contained a syllable-break dot; every break-free one behaved:
         ˈhiːlʌt      no break  -> "HEE-lut"   (as written — worked)
         ˈhiːl.juːt   break     -> "hee-loot"  (glide dropped)
         ˈhiː.ljuːt   break     -> "hee-loot"  (glide dropped)
       So the engine mishandles "." specifically. Aliases avoid the phoneme layer
       entirely and are proven here: "heelyoot" produced the glide correctly, it
       was only the vowel that was wrong. Hence "hell-yoot".
       Aliases carry no stress mark; if stress drifts to the second syllable the
       break-free IPA ˈhɛljuːt is the fallback to try. -->
  <lexeme><grapheme>HELUT</grapheme><alias>hell-yoot</alias></lexeme>
  <lexeme><grapheme>Helut</grapheme><alias>hell-yoot</alias></lexeme>
  <lexeme><grapheme>helut</grapheme><alias>hell-yoot</alias></lexeme>
  <lexeme><grapheme>Mulein</grapheme><phoneme>mʌlˈiːn</phoneme></lexeme>
  <lexeme><grapheme>mulein</grapheme><phoneme>mʌlˈiːn</phoneme></lexeme>
  <lexeme><grapheme>Yosys</grapheme><phoneme>ˈjoʊsɪs</phoneme></lexeme>
  <lexeme><grapheme>homomorphic</grapheme><phoneme>ˌhoʊmoʊˈmɔɹfɪk</phoneme></lexeme>
  <lexeme><grapheme>Homomorphic</grapheme><phoneme>ˌhoʊmoʊˈmɔɹfɪk</phoneme></lexeme>
  <lexeme><grapheme>negacyclic</grapheme><phoneme>ˌnɛɡəˈsaɪklɪk</phoneme></lexeme>
  <lexeme><grapheme>Negacyclic</grapheme><phoneme>ˌnɛɡəˈsaɪklɪk</phoneme></lexeme>
  <lexeme><grapheme>TensorLUT</grapheme><phoneme>ˈtɛnsɚˌlʌt</phoneme></lexeme>
  <lexeme><grapheme>Enigma256</grapheme><alias>Enigma two fifty-six</alias></lexeme>
  <lexeme><grapheme>E256</grapheme><alias>E two fifty-six</alias></lexeme>
  <lexeme><grapheme>FHE</grapheme><alias>F H E</alias></lexeme>
  <lexeme><grapheme>GGSW</grapheme><alias>G G S W</alias></lexeme>
  <lexeme><grapheme>GLWE</grapheme><alias>G L W E</alias></lexeme>
  <lexeme><grapheme>LWE</grapheme><alias>L W E</alias></lexeme>
  <lexeme><grapheme>TFHE</grapheme><alias>T F H E</alias></lexeme>
  <lexeme><grapheme>CPU</grapheme><alias>C P U</alias></lexeme>
  <lexeme><grapheme>GPU</grapheme><alias>G P U</alias></lexeme>
  <lexeme><grapheme>NTT</grapheme><alias>N T T</alias></lexeme>
  <lexeme><grapheme>RISC-V</grapheme><alias>risk five</alias></lexeme>
  <lexeme><grapheme>NOP</grapheme><alias>no op</alias></lexeme>
  <lexeme><grapheme>INIT</grapheme><alias>init</alias></lexeme>
  <!-- JSON is “JAY-sahn” (second syllable as in Japanese -san), not “Jason”.
       Alias, not phoneme: ˈdʒeɪ.sɑːn was unintelligible — same root cause as
       HELUT, the syllable-break dot. "sahn" reads like Kahn/Bahn.
       If it drifts to "sarn", try "jay sonn". -->
  <lexeme><grapheme>JSON</grapheme><alias>jay-sahn</alias></lexeme>
  <lexeme><grapheme>JSONL</grapheme><alias>jay-sahn lines</alias></lexeme>
  <lexeme><grapheme>LUT</grapheme><alias>L U T</alias></lexeme>
  <lexeme><grapheme>DFF</grapheme><alias>D flip-flop</alias></lexeme>
  <lexeme><grapheme>BRAM</grapheme><alias>B ram</alias></lexeme>
  <lexeme><grapheme>KDF</grapheme><alias>K D F</alias></lexeme>
  <lexeme><grapheme>HMAC</grapheme><alias>H mac</alias></lexeme>
  <lexeme><grapheme>XOR</grapheme><alias>exclusive or</alias></lexeme>
  <lexeme><grapheme>AXI</grapheme><alias>ax ee</alias></lexeme>
  <lexeme><grapheme>AXIS</grapheme><alias>axis</alias></lexeme>
  <lexeme><grapheme>SoftBus</grapheme><alias>Soft Bus</alias></lexeme>
  <lexeme><grapheme>MPSGraph</grapheme><alias>M P S Graph</alias></lexeme>
  <lexeme><grapheme>PicoRV32</grapheme><alias>Pico R V thirty-two</alias></lexeme>
  <lexeme><grapheme>SING</grapheme><alias>sing</alias></lexeme>
  <lexeme><grapheme>Welchman</grapheme><phoneme>ˈwɛltʃmən</phoneme></lexeme>
  <lexeme><grapheme>Thetis</grapheme><phoneme>ˈθɛtɪs</phoneme></lexeme>
  <lexeme><grapheme>M-Thetis</grapheme><alias>M Thetis</alias></lexeme>
  <lexeme><grapheme>Bombe</grapheme><alias>bomb</alias></lexeme>
  <lexeme><grapheme>Grund</grapheme><alias>groond</alias></lexeme>
  <lexeme><grapheme>Grundstellung</grapheme><alias>groond shtellung</alias></lexeme>
  <lexeme><grapheme>stecker</grapheme><alias>shtecker</alias></lexeme>
  <lexeme><grapheme>Stecker</grapheme><alias>shtecker</alias></lexeme>
  <lexeme><grapheme>Regenbogen</grapheme><alias>ray gen boh gen</alias></lexeme>
  <lexeme><grapheme>RTL</grapheme><alias>R T L</alias></lexeme>
</lexicon>
