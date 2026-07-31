import unittest


class LLMManagerImportTest(unittest.TestCase):
    def test_import_llm_manager_without_credentials(self):
        import backend.config.llm_manager as llm_manager_module

        self.assertTrue(hasattr(llm_manager_module, "llm_manager"))
        self.assertTrue(hasattr(llm_manager_module.llm_manager, "get_llm"))


if __name__ == "__main__":
    unittest.main()
