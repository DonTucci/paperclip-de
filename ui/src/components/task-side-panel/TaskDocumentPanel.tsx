import { tf } from "@/i18n/fork";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { IssueDocument } from "@paperclipai/shared";
import { FileQuestion, Loader2 } from "lucide-react";
import { ApiError } from "@/api/client";
import { issuesApi } from "@/api/issues";
import { DocumentAnnotationsCountChip, IssueDocumentAnnotations } from "@/components/IssueDocumentAnnotations";
import { MarkdownBody } from "@/components/MarkdownBody";
import { queryKeys } from "@/lib/queryKeys";
import { documentDisplayTitle } from "@/lib/issue-artifacts";
import { useLocation } from "@/lib/router";

export function TaskDocumentPanel({
  issueId,
  documentKey,
  initialDocument,
}: {
  issueId: string;
  documentKey: string;
  initialDocument?: IssueDocument;
}) {
  const location = useLocation();
  const [annotationPanelOpen, setAnnotationPanelOpen] = useState(false);
  const query = useQuery<IssueDocument | null>({
    queryKey: [...queryKeys.issues.documents(issueId), documentKey],
    queryFn: async () => {
      try {
        return await issuesApi.getDocument(issueId, documentKey);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    initialData: initialDocument,
  });

  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {tf("auto.d71a0adaa59e490a")}
      </div>
    );
  }
  if (query.isError) {
    return (
      <div className="py-8 text-sm text-muted-foreground" role="alert">
        {tf("auto.7346359470903212")}
      </div>
    );
  }
  const document = query.data;
  if (!document) {
    return (
      <div className="flex items-start gap-3 py-8 text-sm" role="status">
        <FileQuestion className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium">{tf("auto.d368fef9fa81a3e2")}</p>
          <p className="text-muted-foreground">
            {tf("auto.cea88a8d930e269f")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">{documentDisplayTitle(document)}</h2>
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <span>{`Revision ${document.latestRevisionNumber ?? 1}`}</span>
          <span aria-hidden>·</span>
          <span>{`Updated ${new Date(document.updatedAt).toLocaleString()}`}</span>
          <DocumentAnnotationsCountChip
            issueId={issueId}
            docKey={document.key}
            panelOpen={annotationPanelOpen}
            onToggle={() => setAnnotationPanelOpen((open) => !open)}
          />
        </div>
      </header>
      {document.body.trim() ? (
        <IssueDocumentAnnotations
          issueId={issueId}
          doc={document}
          bodyMarkdown={document.body}
          draftDirty={false}
          draftConflicted={false}
          historicalPreview={false}
          locationHash={location.hash}
          panelOpen={annotationPanelOpen}
          onPanelOpenChange={setAnnotationPanelOpen}
          panelPlacement="popover"
        >
          <MarkdownBody>{document.body}</MarkdownBody>
        </IssueDocumentAnnotations>
      ) : (
        <p className="text-sm text-muted-foreground">{tf("auto.149458228eeb7e85")}</p>
      )}
    </article>
  );
}
