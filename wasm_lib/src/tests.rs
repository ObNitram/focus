#![cfg(target_arch = "wasm32")]

mod json_data;
module_path!(../lib);

#[cfg(test)]
mod tests {
  use wasm_bindgen_test::*;
  use crate::lib::*;
  use crate::json_data::*;


  #[wasm_bindgen_test]
  fn test_json_to_markdown_simple_case() {
    assert_eq!("Martin\n", json_to_markdown(data_1()));
    assert_eq!("Ligne1\nLigne2\nLigne3\n", json_to_markdown(data_2()));
    assert_eq!("normal *gras ***italic **souligner ***all ***normal\n", json_to_markdown(data_3()));
    assert_eq!("Martinrezrer  *rer   ****erererer***\n", json_to_markdown(data_4()));
    assert_eq!("# Titre\nnormalsizetext\n", json_to_markdown(data_5()));
  }


}
