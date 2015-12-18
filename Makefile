SRC_DIR = ./src
INTRO = $(SRC_DIR)/intro.js
OUTRO = $(SRC_DIR)/outro.js

SOURCES = \
	$(SRC_DIR)/jquery.js \
	$(SRC_DIR)/utils.js \
	$(SRC_DIR)/node.js \
	$(SRC_DIR)/elems.js \
	$(SRC_DIR)/aggsymbols.js \
	$(SRC_DIR)/symbols.js \
    $(SRC_DIR)/menu.js \
    $(SRC_DIR)/translate.js \
	$(SRC_DIR)/cursor.js \
	$(SRC_DIR)/input.js \
	$(SRC_DIR)/entry.js

CSS_DIR = $(SRC_DIR)/css
FONT_DIR = $(SRC_DIR)/font/Symbola-Lite

BUILD_DIR = ./build
BUILD_JS = $(BUILD_DIR)/mathx-tree.js

.PHONY: all css font clean

all: css font $(BUILD_JS)

clean:
	rm -rf $(BUILD_DIR)

css:
	@mkdir -p $(BUILD_DIR)
	cp $(CSS_DIR)/* $(BUILD_DIR)

font:
	@mkdir -p $(BUILD_DIR)
	cp $(FONT_DIR)/* $(BUILD_DIR)

$(BUILD_JS): $(INTRO) $(SOURCES) $(OUTRO)
	@mkdir -p $(BUILD_DIR)
	cat $^ > $@
