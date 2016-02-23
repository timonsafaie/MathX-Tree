SRC_DIR   = ./src
CSS_DIR   = $(SRC_DIR)/css
FONT_DIR  = $(SRC_DIR)/font/Symbola
TEST_DIR  = ./test
BUILD_DIR = ./build

INTRO = $(SRC_DIR)/intro.js
OUTRO = $(SRC_DIR)/outro.js
VERSION = $(BUILD_DIR)/version.js

SOURCES = \
	$(SRC_DIR)/external/jquery.js \
	$(SRC_DIR)/locales/zh_CN.js \
	$(SRC_DIR)/utils.js \
	$(SRC_DIR)/node.js \
	$(SRC_DIR)/elems.js \
	$(SRC_DIR)/aggsymbols.js \
	$(SRC_DIR)/symbols.js \
	$(SRC_DIR)/translate.js \
	$(SRC_DIR)/menu.js \
	$(SRC_DIR)/cursor.js \
	$(SRC_DIR)/input.js \
	$(SRC_DIR)/entry.js

TEST_SOURCES = \
	$(TEST_DIR)/test_input.js \
	$(TEST_DIR)/test_translate.js

BUILD_JS = $(BUILD_DIR)/mathx-tree.js
TEST_JS = $(BUILD_DIR)/mathx-tree-test.js

.PHONY: all css font clean test

all: css font $(BUILD_JS)

test: $(TEST_JS)
	@(cd test && iojs test.js)

clean:
	rm -rf $(BUILD_DIR)

css:
	@mkdir -p $(BUILD_DIR)
	cp $(CSS_DIR)/* $(BUILD_DIR)

font:
	@mkdir -p $(BUILD_DIR)
	cp $(FONT_DIR)/* $(BUILD_DIR)

$(BUILD_JS): $(INTRO) $(SOURCES) $(OUTRO) $(VERSION)
	@mkdir -p $(BUILD_DIR)
	cat $^ > $@
	cp $(SRC_DIR)/mxapi.js $(BUILD_DIR)

$(TEST_JS): $(INTRO) $(SOURCES) $(TEST_SOURCES) $(OUTRO)
	@mkdir -p $(BUILD_DIR)
	cat $^ > $@

$(VERSION): 
	@echo "var mxVersion = \"$(shell git rev-parse --short HEAD)\";" > $@
