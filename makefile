start:
	@echo Running Start script...
	@yarn run start
dev:
	@echo Running Dev script...
	@yarn run start:development
build:
	@echo Running Build script...
	@yarn run compile
init: 
	@echo Building Project Dependencies...
	@yarn install
	@echo Built node packages...
	@yarn run check:format
	@echo Formatted code...
	@yarn run compile
	@echo Build complete. Run yarn serve to start the bot.