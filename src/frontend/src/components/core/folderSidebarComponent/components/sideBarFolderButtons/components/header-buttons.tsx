import { useEffect, useState } from "react";
import IconComponent from "@/components/common/genericIconComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUpdateUser } from "@/controllers/API/queries/auth";
import CustomGetStartedProgress from "@/customization/components/custom-get-started-progress";
import { ENABLE_SOCIAL_LINKS } from "@/customization/feature-flags";
import { useI18n } from "@/hooks/use-i18n";
import useAuthStore from "@/stores/authStore";
import { useUtilityStore } from "@/stores/utilityStore";
import { AddFolderButton } from "./add-folder-button";
import { UploadFolderButton } from "./upload-folder-button";

export const HeaderButtons = ({
  handleUploadFlowsToFolder,
  isUpdatingFolder,
  isPending,
  addNewFolder,
}: {
  handleUploadFlowsToFolder: () => void;
  isUpdatingFolder: boolean;
  isPending: boolean;
  addNewFolder: () => void;
}) => {
  const { t } = useI18n();
  const userData = useAuthStore((state) => state.userData);
  const hideGettingStartedProgress = useUtilityStore(
    (state) => state.hideGettingStartedProgress,
  );

  const [isDismissedDialog, setIsDismissedDialog] = useState(
    userData?.optins?.dialog_dismissed,
  );
  const { mutate: updateUser } = useUpdateUser();

  useEffect(() => {
    if (userData) {
      setIsDismissedDialog(userData.optins?.dialog_dismissed);
    }
  }, [userData]);

  const handleDismissDialog = () => {
    setIsDismissedDialog(true);
    updateUser({
      user_id: userData?.id!,
      user: {
        optins: {
          ...userData?.optins,
          dialog_dismissed: true,
        },
      },
    });
  };

  return (
    <>
      {ENABLE_SOCIAL_LINKS &&
        !hideGettingStartedProgress &&
        !isDismissedDialog &&
        userData && (
        <>
          <CustomGetStartedProgress
            handleDismissDialog={handleDismissDialog}
          />

          <div className="-mx-4 mt-1 w-[280px]">
            <hr className="border-t-1 w-full" />
          </div>
        </>
        )}

      <div className="flex shrink-0 items-center justify-between gap-2 pt-2">
        <SidebarTrigger className="lg:hidden">
          <IconComponent name="PanelLeftClose" className="h-4 w-4" />
        </SidebarTrigger>

        <div className="flex-1 text-sm font-medium">{t("main.projects")}</div>
        <div className="flex items-center gap-1">
          <UploadFolderButton
            onClick={handleUploadFlowsToFolder}
            disabled={isUpdatingFolder}
          />
          <AddFolderButton
            onClick={addNewFolder}
            disabled={isUpdatingFolder}
            loading={isPending}
          />
        </div>
      </div>
    </>
  );
};
