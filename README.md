# EDS Starter with Ext JS 7

## Run the application locally

Prerequisites:

* Install [Sencha Cmd 7.0.0.40](https://cdn.sencha.com/cmd/7.0.0.40/jre/SenchaCmd-7.0.0.40-windows-64bit.zip) or a later Cmd version compatible with Ext JS 7.0. Sencha's [compatibility matrix](https://docs.sencha.com/cmd/7.5.0/guides/compatibility_matrix.html) lists Cmd 7.0.0 as the minimum for Ext JS 7.0.
* Download the [Ext JS 7.0 GPL SDK](https://cdn.sencha.com/ext/gpl/ext-7.0.0-gpl.zip) and extract the contents of its `ext-7.0.0` directory to `client/ext`. The installed SDK must therefore contain `client/ext/version.properties`.
* Keep the framework version in `client/workspace.json` aligned with the SDK. The GPL archive currently identifies itself as `7.0.0.168`.

For migration details, see Sencha's [Ext JS 7.0 release notes](https://docs.sencha.com/extjs/7.0.0/guides/whats_new/release_notes.html), [what's-new guide](https://docs.sencha.com/extjs/7.0.0/guides/whats_new/whats_new.html), and [Classic toolkit API diff](https://docs.sencha.com/extjs/7.0.0/guides/whats_new/api_diffs/700_classic_diff.html).

Then run:

1. `cd client`
2. `sencha app install --frameworks=.`
3. `sencha app watch`
4. In another shell, return to the repository root and run `./mvnw spring-boot:run -Dspring.profiles.active=development` (or `.\mvnw.cmd` on Windows).
5. Open <http://localhost:8080>.

The Ext JS SDK and generated `client/build` output are intentionally excluded from source control.

## Build for production

1. Ensure `sencha` is on `PATH` and `client/ext` contains Ext JS 7.0.0.168.
2. Run `./mvnw clean package` (or `.\mvnw.cmd clean package` on Windows).
3. Deploy `target/eds-starter6-jpa.jar` and run it with `java -jar target/eds-starter6-jpa.jar`.

The application listens on port 80 by default.

## Ext JS licensing

Ext JS 7.0 is the last Ext JS release Sencha published under GPLv3. The SDK's `license.txt` requires applications distributed with this GPL edition to comply with GPLv3, including its corresponding-source requirements. This repository's Apache-2.0 license still covers the project's own source files, but it does not replace the Ext JS license or make a combined proprietary distribution permissible. Review Sencha's [open-source FAQ](https://www.sencha.com/legal/open-source-faq/) before distributing the application; use a commercial Ext JS license if GPLv3 is not suitable.

