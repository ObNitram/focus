#![cfg(target_arch = "wasm32")]

mod lib {
    use wasm_bindgen::prelude::*;
    use wasm_bindgen_test::console_log;

    use serde_json::{Result, Value};

    #[wasm_bindgen]
    pub fn json_to_markdown(data: String) -> String {

        let res: Result<Value> = serde_json::from_str(data.as_str());

        if !res.is_ok() {
            console_log!("Json is not valide");
            return String::from("Json is not valide");
        }

        let json_value: Value = res.unwrap();
        console_log!("json: {}", json_value);
      

        return data;
    }

    #[wasm_bindgen]
    pub fn markdown_to_json(markdown: String) -> String {
        return markdown;
    }
}

#[cfg(test)]
mod tests {
    use crate::lib::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn test_json_to_markdown_simple_case() {
        let json: String = r#"
        {
            "root": {
                "children": [
                    {
                        "children": [
                            {
                                "detail": 0,
                                "format": 0,
                                "mode": "normal",
                                "style": "",
                                "text": "  Martin",
                                "type": "text",
                                "version": 1
                            }
                        ],
                        "direction": "ltr",
                        "format": "",
                        "indent": 0,
                        "type": "paragraph",
                        "version": 1
                    }
                ],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "root",
                "version": 1
            }
        }
        "#
        .to_string()
        .replace("\n", "")
        .replace("\t", "")
        .replace(" ", "");
        json_to_markdown(json);
        //assert_eq!("Martin", json_to_markdown(json));
    }
}
