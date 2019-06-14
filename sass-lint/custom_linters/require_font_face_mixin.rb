module SCSSLint
  class Linter::RequireFontFaceMixin < Linter
    include LinterRegistry

    def visit_directive(node)
      msg = "It looks like you are trying to define a custom font using `@font-face`. This should be done using the `fontFace` mixin."

      add_lint node, msg if node.name == '@font-face'

      yield
    end

  end
end
