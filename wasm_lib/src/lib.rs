mod tests;


pub mod lib {
  use wasm_bindgen::prelude::*;
  use wasm_bindgen_test::console_log;

  use serde_derive::{Deserialize, Serialize};
  use serde_json::{Result, Value};


  fn d() -> String {
    return String::from("");
  }

  #[derive(Serialize, Deserialize)]
  struct RootNode {
    children: Vec<Node>,
    //direction: String,
    format: String,
    indent: i32,
    #[serde(rename = "type")]
    node_type: String,
    version: i32,
  }

  #[derive(Serialize, Deserialize)]
  pub struct Node {
    children: Vec<SmallNode>,
    //direction: String,
    format: String,
    indent: i32,
    #[serde(rename = "type")]
    node_type: String,
    version: i32,
    #[serde(default = "d")]
    tag: String,
  }

  #[derive(Serialize, Deserialize)]
  pub struct SmallNode {
    detail: i32,
    format: i32,
    mode: String,
    style: String,
    text: String,
    #[serde(rename = "type")]
    node_type: String,
    version: i32,
  }


  pub fn parce_node(str: &mut String, node: Node) {
    match node.node_type.as_str() {
      //"paragraph" => str.push_str(&("*".to_string() + &small_node.text + &"*".to_string())),
      "heading" => {
        match node.tag.as_str() {
          "h1" => str.push_str("# "),
          "h2" => str.push_str("## "),
          "h3" => str.push_str("### "),
          "h4" => str.push_str("#### "),
          "h5" => str.push_str("##### "),
          "h6" => str.push_str("###### "),
          _ => str.push_str(""),
        }
      }
      "listitem" => {
        str.push_str(&(" - ".to_string() + &node.tag));
      }
      _ => str.push_str(""),
    }


    for small_node in node.children {
      parse_small_node(str, small_node);
    }
    str.push_str("\n");
  }

  pub fn parse_small_node(str: &mut String, small_node: SmallNode) {
    match small_node.format
    {
      0 => str.push_str(&small_node.text),// text
      1 => str.push_str(&("*".to_string() + &small_node.text + &"*".to_string())),
      2 => str.push_str(&("**".to_string() + &small_node.text + &"**".to_string())),
      3 => str.push_str(&("***".to_string() + &small_node.text + &"***".to_string())),
      _ => str.push_str(&small_node.text),
    }
  }


  #[wasm_bindgen]
  pub fn json_to_markdown(data: String) -> String {
    let res: Result<Value> = serde_json::from_str(data.as_str());

    if !res.is_ok() {
      console_log!("Json is not valide");
      return String::from("Json is not valide");
    }

    let json_struct_root: Value = res.unwrap();

    let json_struct: RootNode = serde_json::from_value(json_struct_root["root"].clone()).unwrap();

    let mut markdown = String::new();

    for child in json_struct.children {
      parce_node(&mut markdown, child);
    }

    return markdown;
  }

  #[wasm_bindgen]
  pub fn markdown_to_json(markdown: String) -> String {
    return markdown;
  }
}
