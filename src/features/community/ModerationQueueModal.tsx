import React from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { Button } from '../../components/ui/Button';

interface ModerationQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModerationQueueModal: React.FC<ModerationQueueModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { reports, dismissReport, removeReportedContent } = useCommunity();

  if (!isOpen) return null;

  const pending = reports.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-gray-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-800">صف بررسی و نظارت گزارش‌ها</h3>
            <span className="text-[11px] text-gray-500">
              {pending.length} مورد گزارش جدید برای بررسی
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {pending.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">
              هیچ گزارشی در صف بررسی وجود ندارد.
            </p>
          ) : (
            pending.map((rep) => (
              <div
                key={rep.id}
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-600">علت: {rep.reasonLabel}</span>
                  <span className="text-[10px] text-gray-400">{rep.createdAtText}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100 text-gray-700 text-[11px]">
                  «{rep.contentPreview}»
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissReport(rep.id)}
                  >
                    رد گزارش (مجاز است)
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeReportedContent(rep.id)}
                  >
                    حذف محتوا
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Button variant="outline" fullWidth onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </div>
  );
};
