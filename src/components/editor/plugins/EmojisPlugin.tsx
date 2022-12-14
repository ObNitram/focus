import { $createEmojiNode, EmojiNode } from "../nodes/EmojiNode";
import { useEffect } from "react";
import { TextNode, LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const emojis: { [key: string]: string } = {
  ":grinning:": "๐",
    ":smiley:": "๐",
    ":smile:": "๐",
    ":grin:": "๐",
    ":laughing:": "๐",
    ":satisfied:": "๐",
    ":sweat_smile:": "๐",
    ":rofl:": "๐คฃ",
    ":joy:": "๐",
    ":slightly_smiling_face:": "๐",
    ":upside_down_face:": "๐",
    ":wink:": "๐",
    ":blush:": "๐",
    ":innocent:": "๐",
    ":smiling_face_with_three_hearts:": "๐ฅฐ",
    ":heart_eyes:": "๐",
    ":star_struck:": "๐คฉ",
    ":kissing_heart:": "๐",
    ":kissing:": "๐",
    ":kissing_closed_eyes:": "๐",
    ":kissing_smiling_eyes:": "๐",
    ":smiling_face_with_tear:": "๐ฅฒ",
    ":yum:": "๐",
    ":stuck_out_tongue:": "๐",
    ":stuck_out_tongue_winking_eye:": "๐",
    ":zany_face:": "๐คช",
    ":stuck_out_tongue_closed_eyes:": "๐",
    ":money_mouth_face:": "๐ค",
    ":hugs:": "๐ค",
    ":hand_over_mouth:": "๐คญ",
    ":shushing_face:": "๐คซ",
    ":thinking:": "๐ค",
    ":zipper_mouth_face:": "๐ค",
    ":raised_eyebrow:": "๐คจ",
    ":neutral_face:": "๐",
    ":expressionless:": "๐",
    ":no_mouth:": "๐ถ",
    ":smirk:": "๐",
    ":unamused:": "๐",
    ":roll_eyes:": "๐",
    ":grimacing:": "๐ฌ",
    ":face_exhaling:": "๐ฎโ๐จ",
    ":lying_face:": "๐คฅ",
    ":relieved:": "๐",
    ":pensive:": "๐",
    ":sleepy:": "๐ช",
    ":drooling_face:": "๐คค",
    ":sleeping:": "๐ด",
    ":mask:": "๐ท",
    ":face_with_thermometer:": "๐ค",
    ":face_with_head_bandage:": "๐ค",
    ":nauseated_face:": "๐คข",
    ":vomiting_face:": "๐คฎ",
    ":sneezing_face:": "๐คง",
    ":hot_face:": "๐ฅต",
    ":cold_face:": "๐ฅถ",
    ":woozy_face:": "๐ฅด",
    ":dizzy_face:": "๐ต",
    ":exploding_head:": "๐คฏ",
    ":cowboy_hat_face:": "๐ค?",
    ":partying_face:": "๐ฅณ",
    ":disguised_face:": "๐ฅธ",
    ":sunglasses:": "๐",
    ":nerd_face:": "๐ค",
    ":monocle_face:": "๐ง",
    ":confused:": "๐",
    ":worried:": "๐",
    ":slightly_frowning_face:": "๐",
    ":frowning_face:": "โน๏ธ",
    ":open_mouth:": "๐ฎ",
    ":hushed:": "๐ฏ",
    ":astonished:": "๐ฒ",
    ":flushed:": "๐ณ",
    ":pleading_face:": "๐ฅบ",
    ":frowning:": "๐ฆ",
    ":anguished:": "๐ง",
    ":fearful:": "๐จ",
    ":cold_sweat:": "๐ฐ",
    ":disappointed_relieved:": "๐ฅ",
    ":cry:": "๐ข",
    ":sob:": "๐ญ",
    ":scream:": "๐ฑ",
    ":confounded:": "๐",
    ":persevere:": "๐ฃ",
    ":disappointed:": "๐",
    ":sweat:": "๐",
    ":weary:": "๐ฉ",
    ":tired_face:": "๐ซ",
    ":yawning_face:": "๐ฅฑ",
    ":triumph:": "๐ค",
    ":pout:": "๐ก",
    ":rage:": "๐?",
    ":angry:": "๐?",
    ":cursing_face:": "๐คฌ",
    ":smiling_imp:": "๐",
    ":imp:": "๐ฟ",
    ":skull:": "๐",
    ":skull_and_crossbones:": "โ?๏ธ",
    ":hankey:": "๐ฉ",
    ":poop:": "๐ฉ",
    ":shit:": "๐ฉ",
    ":clown_face:": "๐คก",
    ":japanese_ogre:": "๐น",
    ":japanese_goblin:": "๐บ",
    ":ghost:": "๐ป",
    ":alien:": "๐ฝ",
    ":space_invader:": "๐พ",
    ":robot:": "๐ค",
    ":smiley_cat:": "๐บ",
    ":smile_cat:": "๐ธ",
    ":joy_cat:": "๐น",
    ":heart_eyes_cat:": "๐ป",
    ":smirk_cat:": "๐ผ",
    ":kissing_cat:": "๐ฝ",
    ":scream_cat:": "๐",
    ":crying_cat_face:": "๐ฟ",
    ":pouting_cat:": "๐พ",
    ":see_no_evil:": "๐",
    ":hear_no_evil:": "๐",
    ":speak_no_evil:": "๐",
    ":kiss:": "๐",
    ":love_letter:": "๐",
    ":cupid:": "๐",
    ":gift_heart:": "๐",
    ":sparkling_heart:": "๐",
    ":heartpulse:": "๐",
    ":heartbeat:": "๐",
    ":revolving_hearts:": "๐",
    ":two_hearts:": "๐",
    ":heart_decoration:": "๐",
    ":heavy_heart_exclamation:": "โฃ๏ธ",
    ":broken_heart:": "๐",
    ":heart:": "โค๏ธ",
    ":orange_heart:": "๐งก",
    ":yellow_heart:": "๐",
    ":green_heart:": "๐",
    ":blue_heart:": "๐",
    ":purple_heart:": "๐",
    ":brown_heart:": "๐ค",
    ":black_heart:": "๐ค",
    ":white_heart:": "๐ค",
    ":100:": "๐ฏ",
    ":anger:": "๐ข",
    ":boom:": "๐ฅ",
    ":collision:": "๐ฅ",
    ":dizzy:": "๐ซ",
    ":sweat_drops:": "๐ฆ",
    ":dash:": "๐จ",
    ":hole:": "๐ณ๏ธ",
    ":bomb:": "๐ฃ",
    ":speech_balloon:": "๐ฌ",
    ":eye_speech_bubble:": "๐๏ธโ๐จ๏ธ",
    ":left_speech_bubble:": "๐จ๏ธ",
    ":right_anger_bubble:": "๐ฏ๏ธ",
    ":thought_balloon:": "๐ญ",
    ":zzz:": "๐ค",
    ":wave:": "๐",
    ":raised_back_of_hand:": "๐ค",
    ":raised_hand_with_fingers_splayed:": "๐๏ธ",
    ":hand:": "โ",
    ":raised_hand:": "โ",
    ":vulcan_salute:": "๐",
    ":ok_hand:": "๐",
    ":pinched_fingers:": "๐ค",
    ":pinching_hand:": "๐ค",
    ":v:": "โ๏ธ",
    ":crossed_fingers:": "๐ค",
    ":love_you_gesture:": "๐ค",
    ":metal:": "๐ค",
    ":call_me_hand:": "๐ค",
    ":point_left:": "๐",
    ":point_right:": "๐",
    ":point_up_2:": "๐",
    ":fu:": "๐",
    ":middle_finger:": "๐",
    ":point_down:": "๐",
    ":point_up:": "โ๏ธ",
    ":thumbsup:": "๐",
    ":thumbsdown:": "๐",
    ":fist:": "โ",
    ":fist_raised:": "โ",
    ":facepunch:": "๐",
    ":fist_oncoming:": "๐",
    ":punch:": "๐",
    ":fist_left:": "๐ค",
    ":fist_right:": "๐ค",
    ":clap:": "๐",
    ":raised_hands:": "๐",
    ":open_hands:": "๐",
    ":palms_up_together:": "๐คฒ",
    ":handshake:": "๐ค",
    ":pray:": "๐",
    ":writing_hand:": "โ๏ธ",
    ":nail_care:": "๐",
    ":selfie:": "๐คณ",
    ":muscle:": "๐ช",
};

function emoticonTransform(node: EmojiNode) {
  const textContent = node.getTextContent();

  textContent.replace(/:[a-z_]+:/g, (word: string): string => {
    if (word in emojis) {

      const offset = textContent.indexOf(word);
      const length = word.length;

      const textsNodes: TextNode[] = node.splitText(offset, offset + length);

      textsNodes.find((textNode) => {
        if (textNode.getTextContent() === word) {
          textNode.replace($createEmojiNode("emoji", emojis[word]));
        }
      });
    }
    return word;
  });
}

function useEmojis(editor: LexicalEditor) {
  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(
      TextNode,
      emoticonTransform,
    );

    return () => {
      removeTransform();
    };
  }, [editor]);
}

export default function EmojisPlugin() {
  const [editor] = useLexicalComposerContext();
  useEmojis(editor);
  return null;
}
