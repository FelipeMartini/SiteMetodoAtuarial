
   - Environments: .env.local, .env

   Creating an optimized production build ...
Failed to compile.

./src/app/area-cliente/DashboardAdmin.tsx
Error:   x Expected a semicolon
    ,-[/home/felipe/Área de Trabalho/GitHub/SiteMetodoAtuarial/site-metodo/src/app/area-cliente/DashboardAdmin.tsx:36:1]
 33 |         const data = await res.json();
 34 |         setUsuarios(data.usuarios || []);
 35 |       } catch (e) {
 36 |         } catch (_e) {
    :           ^^^^^
 37 |           setMensagem("Erro ao buscar usuários.");
 38 |       } finally {
 39 |         setIsLoading(false);
    `----
  x Expected a semicolon
    ,-[/home/felipe/Área de Trabalho/GitHub/SiteMetodoAtuarial/site-metodo/src/app/area-cliente/DashboardAdmin.tsx:62:1]
 59 |         const data = await res.json();
 60 |         setUsuarios(data.usuarios || []);
 61 |       } catch (e) {
 62 |         } catch (_e) {
    :           ^^^^^
 63 |           setMensagem("Erro ao buscar usuários.");
 64 |       }
 65 |     } else {
    `----

Caused by:
    Syntax Error

Import trace for requested module:
./src/app/area-cliente/DashboardAdmin.tsx
./src/app/area-cliente/dashboard-admin/page.tsx


> Build failed because of webpack errors
felipe@malinuxprojeto:~/Área de Trabalho/GitHub/SiteMetodoAtuarial/site-metodo$ 