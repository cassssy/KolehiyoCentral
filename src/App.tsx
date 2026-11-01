import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ApplicationsPage } from "./screens/ApplicationsPage";
import { DirectoryPage } from "./screens/DirectoryPage";
import { PeriodsPage } from "./screens/PeriodsPage";
import { ProfilePage } from "./screens/ProfilePage";
import { UniversityPage } from "./screens/UniversityPage";
import { DemoProvider } from "./store";

export function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DirectoryPage />} />
            <Route path="universities/:universityId" element={<UniversityPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="periods" element={<PeriodsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}
