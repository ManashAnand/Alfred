"use client";
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from "sonner";

const LazyDocViewer = dynamic(() => import("@cyntler/react-doc-viewer"), {
  ssr: false,
  loading: () => <div>Loading viewer...</div>, 
});

const DocumentViewer = ({ sliderPosition }: { sliderPosition: number }) => {
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [singleResume, setSingleResume] = useState("");
  const bearer = getCookie('Bearer');

  useEffect(() => {
    const getUserResume = async () => {
      setLoadingDoc(true);
      try {
        const { data } = await axios.get(`/api/get-resume`, {
          headers: {
            Authorization: `Bearer ${bearer}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data?.resume_url !== singleResume) {
          setSingleResume(data.resume_url);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        toast("Error in fetching resume.");
      } finally {
        setLoadingDoc(false);
      }
    };

    getUserResume();
  }, [bearer, singleResume]);

  // Memoize the document array to prevent unnecessary re-renders
  const docs = useMemo(() => [
    { uri: singleResume || "https://bsoiyznqywunudwdzuty.supabase.co/storage/v1/object/public/testing-bucket/Form_Rp_Ang_a64dfc99-7036-41a3-bbd9-fa861b2c4a09_1730221502.pdf" },
  ], [singleResume]);

  return (
    <div className="w-full lg:w-[50%] p-4 overflow-auto" style={{ width: `${sliderPosition}%` }}>
      {loadingDoc ? (
        <div>Loading Resume...</div>
      ) : (
        <LazyDocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
      )}
    </div>
  );
};

export default DocumentViewer;
