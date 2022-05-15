/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
    Copyright (C) 2022, ThatGuyJamal and contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.
 */

import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { common } from "../utils/common";

const Docs: NextPage = () => {
	const router = useRouter();

	// Sends us to the invite url
	useEffect(() => {
		const { pathname } = router;
		if (pathname == "/docs") {
			router.push(common.website_documentation_link);
		}
	});

	return (
		<>
			<h1>Redirecting to the documentation...</h1>
		</>
	);
};

export default Docs;
