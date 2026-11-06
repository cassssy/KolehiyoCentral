import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ApplicationsPage } from "./screens/ApplicationsPage";
import { DashboardPage } from "./screens/DashboardPage";
import { DirectoryPage } from "./screens/DirectoryPage";
import { DocumentsPage } from "./screens/DocumentsPage";
import { PeriodsPage } from "./screens/PeriodsPage";
import { ProfilePage } from "./screens/ProfilePage";
import { ScholarshipsPage } from "./screens/ScholarshipsPage";
import { UniversityPage } from "./screens/UniversityPage";
import { DemoProvider } from "./store";

export function App() {
  return (
    <DemoProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="universities" element={<DirectoryPage />} />
            <Route path="universities/:universityId" element={<UniversityPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="scholarships" element={<ScholarshipsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="periods" element={<PeriodsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DemoProvider>
  );
}
