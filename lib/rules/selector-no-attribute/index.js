"use strict"

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "selector-no-attribute"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected attribute selector",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      const selector = rule.selector

      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkAttributes(attribute => {
          report({
            message: messages.rejected,
            node: rule,
            index: attribute.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
